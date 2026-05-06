# Sistema de Backup Automatizado — Guia de Implementação

Documento de referência para replicar este sistema de backup em outros projetos
Next.js + Payload CMS + PostgreSQL + Docker Compose. Validado em produção no
projeto Trakinagem Cine.

**O que esse sistema entrega:**

- Backup automático diário (DB + volume de mídia) em bundle único `.tar`
- Retenção configurável: diário / semanal / mensal
- Upload para Google Drive via rclone
- Painel admin com 4 abas: Retenção, Drive, Agendamento, Status
- Botão "Backup Agora" no Dashboard (cria trigger; cron de 1min executa)
- Script de restore com confirmação explícita
- Disaster Recovery documentado

---

## 📋 Substituições por projeto

Antes de copiar os arquivos, identifique no novo projeto:

| Variável | Exemplo neste projeto | Onde usa |
|---|---|---|
| `<PROJETO>` | `trakinagemcine` | container names, db name, paths |
| `<PROJECT_ROOT>` | `/srv/clientes/victor/trakinagemcine` | absolute path do projeto |
| `<DB_NAME>` | `trakinagemcine` | nome do banco Postgres |
| `<DB_USER>` | `trakinagem` | usuário Postgres |
| `<MEDIA_VOLUME>` | `<PROJETO>_media_data` | volume do Docker (geralmente `<PROJETO>_media_data`) |
| `<DRIVE_REMOTE>` | `gdrive` | nome do remote no rclone |
| `<DRIVE_FOLDER>` | `backups/<PROJETO>` | pasta no Google Drive |

Faça Find/Replace de `trakinagemcine` → seu projeto em todos os arquivos
mostrados abaixo.

---

## 🗂️ Arquivos a criar

### 1. `scripts/backup.sh`

Script principal. Faz dump do DB, tarball da mídia, bundle único, aplica
retenção e envia pro Drive. Lê config do Postgres direto (não da API).

```bash
#!/bin/bash
# ============================================================
# <PROJETO> — Backup completo (DB + Media)
# ============================================================
set -euo pipefail

# ─── Configurações ──────────────────────────────────────────
PROJECT_ROOT="<PROJECT_ROOT>"
BACKUP_DIR="${PROJECT_ROOT}/backups"
DB_CONTAINER="<PROJETO>_db"
APP_CONTAINER="<PROJETO>"
DB_NAME="${DB_NAME:-<PROJETO>}"
DB_USER="${DB_USER:-<DB_USER>}"
MEDIA_VOLUME="<PROJETO>_media_data"

DATE=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)
DAY_OF_MONTH=$(date +%d)

# Categoria automática (daily/weekly/monthly)
CATEGORY="daily"
[ "$DAY_OF_WEEK" = "7" ] && CATEGORY="weekly"
[ "$DAY_OF_MONTH" = "01" ] && CATEGORY="monthly"

DAILY_DIR="${BACKUP_DIR}/daily"
WEEKLY_DIR="${BACKUP_DIR}/weekly"
MONTHLY_DIR="${BACKUP_DIR}/monthly"
LOG_FILE="${BACKUP_DIR}/backup.log"

mkdir -p "$DAILY_DIR" "$WEEKLY_DIR" "$MONTHLY_DIR"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# ─── Buscar config do admin (lê direto do Postgres) ─────────
RETENTION_DAILY=7
RETENTION_WEEKLY=4
RETENTION_MONTHLY=6
DRIVE_ENABLED="false"
DRIVE_REMOTE="<DRIVE_REMOTE>"
DRIVE_FOLDER="<DRIVE_FOLDER>"

if docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
  CFG=$(docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -A -F'|' \
    -c "SELECT retention_daily, retention_weekly, retention_monthly, drive_enabled, drive_remote_name, drive_folder FROM backup_config LIMIT 1;" 2>/dev/null || echo "")
  if [ -n "$CFG" ]; then
    IFS='|' read -r RETENTION_DAILY RETENTION_WEEKLY RETENTION_MONTHLY DRIVE_ENABLED_RAW DRIVE_REMOTE DRIVE_FOLDER <<< "$CFG"
    [ "$DRIVE_ENABLED_RAW" = "t" ] && DRIVE_ENABLED="true" || DRIVE_ENABLED="false"
    RETENTION_DAILY=${RETENTION_DAILY:-7}
    RETENTION_WEEKLY=${RETENTION_WEEKLY:-4}
    RETENTION_MONTHLY=${RETENTION_MONTHLY:-6}
    log "📋 Config: retention=${RETENTION_DAILY}/${RETENTION_WEEKLY}/${RETENTION_MONTHLY} drive=${DRIVE_ENABLED} (${DRIVE_REMOTE}:${DRIVE_FOLDER})"
  fi
fi

# ─── Atualizar status ───────────────────────────────────────
update_status() {
  local status="$1" message="$2" size="${3:-0}"
  if command -v curl >/dev/null; then
    curl -sf -X POST "http://localhost:3000/api/admin/backup/status" \
      -H "Content-Type: application/json" \
      -d "{\"status\":\"${status}\",\"message\":$(printf '%s' "$message" | jq -Rsa .),\"size\":${size}}" \
      >/dev/null 2>&1 || true
  fi
}

update_status "running" "Backup iniciado..."

# ─── 1. Dump PostgreSQL ─────────────────────────────────────
DB_FILE="${DAILY_DIR}/db_${DATE}.sql.gz"
log "🗄️  Dumping ${DB_NAME}..."
if docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$DB_FILE"; then
  DB_SIZE=$(du -sb "$DB_FILE" | cut -f1)
  log "  ✅ DB: ${DB_FILE} ($(numfmt --to=iec ${DB_SIZE}))"
else
  log "  ❌ FALHA no dump do DB!"
  update_status "error" "Falha ao fazer dump do PostgreSQL"
  exit 1
fi

# ─── 2. Tarball do volume de mídia ──────────────────────────
MEDIA_FILE="${DAILY_DIR}/media_${DATE}.tar.gz"
log "🖼️  Empacotando volume de mídia..."
if docker run --rm \
  -v "${MEDIA_VOLUME}:/data:ro" \
  -v "${DAILY_DIR}:/backup" \
  alpine sh -c "tar czf /backup/media_${DATE}.tar.gz -C /data ."; then
  MEDIA_SIZE=$(du -sb "$MEDIA_FILE" | cut -f1)
  log "  ✅ Mídia: ${MEDIA_FILE} ($(numfmt --to=iec ${MEDIA_SIZE}))"
else
  log "  ⚠ FALHA no backup de mídia (continuando — DB já salvo)"
  MEDIA_SIZE=0
fi

# ─── 3. Bundle final ────────────────────────────────────────
BUNDLE="${DAILY_DIR}/<PROJETO>_${DATE}.tar"
tar -cf "$BUNDLE" -C "$DAILY_DIR" "db_${DATE}.sql.gz" "media_${DATE}.tar.gz" 2>/dev/null || true
rm -f "${DAILY_DIR}/db_${DATE}.sql.gz" "${DAILY_DIR}/media_${DATE}.tar.gz"
TOTAL_SIZE=$(du -sb "$BUNDLE" | cut -f1)
log "📦 Bundle: ${BUNDLE} ($(numfmt --to=iec ${TOTAL_SIZE}))"

# ─── 4. Cópia para weekly/monthly ───────────────────────────
if [ "$CATEGORY" = "weekly" ]; then
  cp "$BUNDLE" "${WEEKLY_DIR}/"
  log "📅 Copiado para weekly/"
elif [ "$CATEGORY" = "monthly" ]; then
  cp "$BUNDLE" "${MONTHLY_DIR}/"
  log "📆 Copiado para monthly/"
fi

# ─── 5. Retenção ────────────────────────────────────────────
prune() {
  local dir="$1" keep="$2"
  local files
  files=$(cd "$dir" && shopt -s nullglob && ls -t <PROJETO>_*.tar 2>/dev/null || true)
  [ -z "$files" ] && return 0
  echo "$files" | tail -n +$((keep + 1)) | while read -r f; do
    [ -z "$f" ] && continue
    rm -f "${dir}/$f"
    log "🗑️  Removido: ${dir}/$f"
  done
}
prune "$DAILY_DIR" "$RETENTION_DAILY" || true
prune "$WEEKLY_DIR" "$RETENTION_WEEKLY" || true
prune "$MONTHLY_DIR" "$RETENTION_MONTHLY" || true

# ─── 6. Upload Google Drive ─────────────────────────────────
if [ "$DRIVE_ENABLED" = "true" ]; then
  if command -v rclone >/dev/null; then
    log "☁️  Enviando para Google Drive (${DRIVE_REMOTE}:${DRIVE_FOLDER})..."
    if rclone sync "$BACKUP_DIR" "${DRIVE_REMOTE}:${DRIVE_FOLDER}" \
      --exclude "*.log" --exclude "cron.log" --exclude ".*" \
      --transfers 2 --checkers 4 \
      --log-file "$LOG_FILE" --log-level INFO; then
      log "  ✅ Upload concluído"
    else
      log "  ⚠ Falha no upload (backup local OK)"
    fi
  else
    log "  ⚠ rclone não instalado — pulando upload"
  fi
fi

log "✔ Backup concluído com sucesso (${CATEGORY})"
update_status "success" "Backup ${CATEGORY} concluído com sucesso." "$TOTAL_SIZE"
```

### 2. `scripts/restore.sh`

```bash
#!/bin/bash
# ============================================================
# <PROJETO> — Restore (DB + Media)
# ============================================================
set -euo pipefail

PROJECT_ROOT="<PROJECT_ROOT>"
DB_CONTAINER="<PROJETO>_db"
APP_CONTAINER="<PROJETO>"
DB_NAME="${DB_NAME:-<PROJETO>}"
DB_USER="${DB_USER:-<DB_USER>}"
MEDIA_VOLUME="<PROJETO>_media_data"

if [ $# -lt 1 ]; then
  echo "❌ Uso: $0 <caminho-do-bundle.tar>"
  echo "Backups disponíveis:"
  find "${PROJECT_ROOT}/backups" -name "<PROJETO>_*.tar" -type f 2>/dev/null | sort -r | head -10
  exit 1
fi

BUNDLE="$1"
[ -f "$BUNDLE" ] || { echo "❌ Bundle não encontrado: $BUNDLE"; exit 1; }

echo "⚠️  ATENÇÃO: O conteúdo atual do banco e da mídia será APAGADO."
echo "   Bundle: $BUNDLE"
read -p "Digite 'SIM' para confirmar: " CONFIRM
[ "$CONFIRM" = "SIM" ] || { echo "Cancelado."; exit 0; }

WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

echo "📦 Extraindo bundle..."
tar -xf "$BUNDLE" -C "$WORK_DIR"
DB_GZ=$(ls "$WORK_DIR"/db_*.sql.gz 2>/dev/null | head -1)
MEDIA_GZ=$(ls "$WORK_DIR"/media_*.tar.gz 2>/dev/null | head -1)

[ -n "$DB_GZ" ] || { echo "❌ db_*.sql.gz não encontrado"; exit 1; }

# Para app pra liberar conexões
echo "  ⏸️  Pausando app..."
docker stop "$APP_CONTAINER" >/dev/null 2>&1 || true
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${DB_NAME}' AND pid <> pg_backend_pid();" >/dev/null

docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE ${DB_NAME};"
gunzip -c "$DB_GZ" | docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" >/dev/null
echo "  ✅ DB restaurado"

if [ -n "$MEDIA_GZ" ]; then
  echo "🖼️  Restaurando volume de mídia..."
  docker run --rm \
    -v "${MEDIA_VOLUME}:/data" \
    -v "$(dirname "$MEDIA_GZ"):/backup:ro" \
    alpine sh -c "rm -rf /data/* && tar xzf /backup/$(basename "$MEDIA_GZ") -C /data"
  echo "  ✅ Mídia restaurada"
fi

echo "🔄 Iniciando app..."
docker start "$APP_CONTAINER" >/dev/null 2>&1 || \
  docker compose -f "${PROJECT_ROOT}/docker-compose.yml" up -d app >/dev/null
echo "  ✅ App iniciado"
echo "✔ Restore concluído com sucesso."
```

### 3. `scripts/trigger-watcher.sh`

```bash
#!/bin/bash
# ============================================================
# Trigger watcher — dispara backup quando admin solicita
# ============================================================
set -euo pipefail

PROJECT_ROOT="<PROJECT_ROOT>"
TRIGGER_FILE="${PROJECT_ROOT}/backups/.backup-requested"
BACKUP_SCRIPT="${PROJECT_ROOT}/scripts/backup.sh"
LOCK_FILE="${PROJECT_ROOT}/backups/.backup-running"

[ -f "$TRIGGER_FILE" ] || exit 0

if [ -f "$LOCK_FILE" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⏭️  Backup já em execução."
  exit 0
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔔 Trigger detectado."
touch "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT
rm -f "$TRIGGER_FILE"

/bin/bash "$BACKUP_SCRIPT"
```

### 4. `src/globals/BackupConfig.ts`

Global do Payload com 4 abas (Retenção, Drive, Agendamento, Status). Copie
exatamente como está no projeto Trakinagem Cine — não precisa mudar nada
exceto o `slug` se quiser.

```ts
import type { GlobalConfig } from 'payload'

export const BackupConfig: GlobalConfig = {
  slug: 'backup-config',
  label: 'Backups',
  admin: {
    group: 'Sistema',
    description:
      '🛡️ Configurações de backup automático (banco de dados + mídias). Os backups são salvos localmente e enviados para o Google Drive via rclone.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Retenção',
          description: 'Quantos backups manter de cada tipo.',
          fields: [
            { name: 'retentionDaily', label: 'Manter backups diários (dias)', type: 'number', defaultValue: 7, min: 1, max: 90 },
            { name: 'retentionWeekly', label: 'Manter backups semanais', type: 'number', defaultValue: 4, min: 0, max: 52 },
            { name: 'retentionMonthly', label: 'Manter backups mensais', type: 'number', defaultValue: 6, min: 0, max: 36 },
          ],
        },
        {
          label: 'Google Drive',
          description: 'Envio automático para Google Drive via rclone.',
          fields: [
            { name: 'driveEnabled', label: 'Enviar para Google Drive', type: 'checkbox', defaultValue: false },
            { name: 'driveRemoteName', label: 'Nome do remote (rclone)', type: 'text', defaultValue: '<DRIVE_REMOTE>' },
            { name: 'driveFolder', label: 'Pasta no Google Drive', type: 'text', defaultValue: '<DRIVE_FOLDER>' },
          ],
        },
        {
          label: 'Agendamento',
          description: 'Apenas referência — configurado no crontab da VPS.',
          fields: [
            { name: 'cronSchedule', label: 'Horário programado (cron)', type: 'text', defaultValue: '0 3 * * *' },
          ],
        },
        {
          label: 'Status',
          description: 'Atualizado automaticamente pelo script. Apenas leitura.',
          fields: [
            { name: 'lastBackupAt', label: 'Última execução', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
            { name: 'lastBackupSize', label: 'Tamanho (bytes)', type: 'number', admin: { readOnly: true } },
            { name: 'lastBackupStatus', label: 'Status', type: 'select', options: [
              { label: '✅ Sucesso', value: 'success' },
              { label: '❌ Falha', value: 'error' },
              { label: '⏳ Em execução', value: 'running' },
            ], admin: { readOnly: true } },
            { name: 'lastBackupMessage', label: 'Mensagem', type: 'textarea', admin: { readOnly: true } },
          ],
        },
      ],
    },
  ],
}
```

### 5. `src/app/api/admin/backup/route.ts`

Endpoint admin para listar/triggerar/deletar backups.

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { headers as nextHeaders } from 'next/headers'
import fs from 'fs/promises'
import path from 'path'

const BACKUP_ROOT = process.env.BACKUP_ROOT || '/app/backups'
const TRIGGER_FILE = path.join(BACKUP_ROOT, '.backup-requested')

async function requireAuth() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await nextHeaders() })
  return user
}

export async function GET() {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result: Record<string, any[]> = {}
  for (const cat of ['daily', 'weekly', 'monthly'] as const) {
    const dir = path.join(BACKUP_ROOT, cat)
    try {
      const files = await fs.readdir(dir)
      const items = await Promise.all(
        files.filter((f) => f.endsWith('.tar')).map(async (f) => {
          const stat = await fs.stat(path.join(dir, f))
          return { filename: f, category: cat, size: stat.size, createdAt: stat.mtime.toISOString() }
        }),
      )
      result[cat] = items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    } catch { result[cat] = [] }
  }
  return NextResponse.json(result)
}

export async function POST() {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await fs.mkdir(BACKUP_ROOT, { recursive: true })
  await fs.writeFile(TRIGGER_FILE, JSON.stringify({
    requestedAt: new Date().toISOString(),
    requestedBy: user.email,
  }))
  return NextResponse.json({
    ok: true,
    message: 'Backup solicitado. Iniciará em até 1 minuto via cron.',
  })
}

export async function DELETE(req: NextRequest) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { filename, category } = await req.json()
  if (!['daily', 'weekly', 'monthly'].includes(category)) return NextResponse.json({ error: 'invalid category' }, { status: 400 })
  await fs.unlink(path.join(BACKUP_ROOT, category, filename))
  return NextResponse.json({ ok: true })
}
```

### 6. `src/app/api/admin/backup/status/route.ts`

Endpoint interno chamado pelo `backup.sh` pra atualizar status.

```ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for') || ''
  const realIp = req.headers.get('x-real-ip') || ''
  const isLocal =
    (!forwardedFor && !realIp) ||
    forwardedFor.startsWith('127.') || realIp.startsWith('127.') ||
    forwardedFor.startsWith('::1') || realIp.startsWith('::1') ||
    forwardedFor.startsWith('172.') || realIp.startsWith('172.') ||
    forwardedFor.startsWith('10.') || realIp.startsWith('10.')
  if (!isLocal) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { status, message, size } = await req.json()
  if (!['running', 'success', 'error'].includes(status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 })
  }

  const payload = await getPayloadClient()
  await payload.updateGlobal({
    slug: 'backup-config' as any,
    data: {
      lastBackupAt: new Date().toISOString(),
      lastBackupStatus: status,
      lastBackupMessage: message || '',
      lastBackupSize: typeof size === 'number' ? size : 0,
    },
  })
  return NextResponse.json({ ok: true })
}
```

### 7. `docker-compose.yml` — adições necessárias

No serviço `app`, adicione bind mounts e env:

```yaml
services:
  app:
    # ... resto da config existente
    environment:
      - NODE_ENV=production
      - BACKUP_ROOT=/app/backups
    volumes:
      - media_data:/app/media
      - ./src/migrations:/app/src/migrations  # migrations vão pro git
      - ./backups:/app/backups                # API admin enxerga bundles
```

### 8. Card de Backup no Dashboard

Adicione ao `src/components/admin/Dashboard.tsx` um card que:

- Lê `/api/globals/backup-config` pra mostrar último status
- Chama `POST /api/admin/backup` no botão "Fazer Backup Agora"
- Exibe seção colapsável com instruções de setup

(Copie do projeto Trakinagem Cine — código completo está em
`src/components/admin/Dashboard.tsx` no commit `82da268`.)

---

## 🔧 Setup na VPS (uma vez)

### 1. Instalar dependências

```bash
sudo apt-get update
sudo apt-get install -y rclone jq curl cron
sudo systemctl enable cron --now
```

### 2. Configurar Google Drive (rclone)

Como o servidor é headless, use o fluxo de **token externo**:

```bash
rclone config
# n) New remote
# name> <DRIVE_REMOTE>          (ex: gdrive)
# Storage> drive
# (deixe client_id e client_secret em branco)
# scope> 1                       (Full access)
# advanced config? n
# auto config? n                 ⚠️ N pra servidor headless
```

O rclone vai mostrar:

```
Execute the following on the machine with the web browser:
    rclone authorize "drive"
Then paste the result.
```

**Em outra máquina (com browser e rclone instalado):**

```bash
rclone authorize "drive"
# Browser abre, autoriza, terminal imprime um JSON:
# {"access_token":"...","refresh_token":"...","expiry":"..."}
```

Copie o JSON inteiro e cole de volta no terminal da VPS. Confirme as
próximas perguntas e digite `q` pra sair.

**Teste:**
```bash
rclone lsd <DRIVE_REMOTE>:
# deve listar pastas do seu Drive
```

### 3. Migration + permissões

```bash
cd <PROJECT_ROOT>
docker compose up -d --build

# Permitir nextjs (uid 1001) escrever em /app/src/migrations
docker exec --user root <PROJETO> chmod -R 777 /app/src/migrations

# Gerar migration do BackupConfig
docker compose exec app npx payload migrate:create add_backup_config
docker compose exec app npx payload migrate

# Permitir nextjs escrever em /app/backups (pra criar trigger files)
docker exec --user root <PROJETO> chmod 777 /app/backups
```

### 4. Tornar scripts executáveis

```bash
chmod +x scripts/backup.sh scripts/restore.sh scripts/trigger-watcher.sh
```

### 5. Teste manual

```bash
# Backup manual (deve gerar bundle + status no admin)
/bin/bash scripts/backup.sh

# Confirmar bundle
ls -lh backups/daily/

# Confirmar upload pro Drive (se ativado no admin)
rclone ls <DRIVE_REMOTE>:<DRIVE_FOLDER>
```

### 6. Agendar cron

```bash
(crontab -l 2>/dev/null; cat <<'EOF'
0 3 * * * /bin/bash <PROJECT_ROOT>/scripts/backup.sh >> <PROJECT_ROOT>/backups/cron.log 2>&1
* * * * * /bin/bash <PROJECT_ROOT>/scripts/trigger-watcher.sh >> <PROJECT_ROOT>/backups/cron.log 2>&1
EOF
) | crontab -

crontab -l   # confirmar
```

---

## 🚨 Restore em Catástrofe

Quando precisar reconstruir tudo do zero:

```bash
# 1. Clonar repo
git clone <repo-url> <PROJECT_ROOT>
cd <PROJECT_ROOT>

# 2. Restaurar .env (do seu cofre/vault)
cp /caminho/seguro/.env.backup .env

# 3. Reconfigurar rclone na VPS nova
sudo apt-get install -y rclone jq curl cron
rclone config  # criar remote <DRIVE_REMOTE> de novo

# 4. Baixar último backup do Drive
mkdir -p backups
rclone copy <DRIVE_REMOTE>:<DRIVE_FOLDER> ./backups

# 5. Subir containers
docker compose up -d --build
docker compose ps  # aguardar healthy

# 6. Aplicar migrations
docker exec --user root <PROJETO> chmod -R 777 /app/src/migrations
docker compose exec app npx payload migrate

# 7. Restaurar do bundle mais recente
chmod +x scripts/restore.sh
LATEST=$(ls -t backups/daily/<PROJETO>_*.tar | head -1)
/bin/bash scripts/restore.sh "$LATEST"
# Digite SIM quando solicitado

# 8. Reagendar cron
docker exec --user root <PROJETO> chmod 777 /app/backups
# (mesmos comandos do passo 6 do setup)
```

---

## 🩺 Troubleshooting

### Backup manual via admin não dispara

```bash
# Confirmar trigger criado
ls -la backups/.backup-requested

# Confirmar cron rodando
sudo systemctl status cron
crontab -l | grep trigger-watcher

# Disparar manualmente o watcher
/bin/bash scripts/trigger-watcher.sh
```

### Status no admin não atualiza

O `backup.sh` chama `POST /api/admin/backup/status` em `localhost:3000`. Se
o app está em outra porta ou bind diferente, ajuste `SITE_API` no script.

```bash
docker compose ps  # confirmar nome do container e porta
curl http://localhost:3000/api/globals/backup-config  # deve retornar 403 (precisa auth)
```

### `EACCES: permission denied` em `/app/backups/.backup-requested`

```bash
docker exec --user root <PROJETO> chmod 777 /app/backups
```

### Migration falha com `EACCES`

```bash
docker exec --user root <PROJETO> chmod -R 777 /app/src/migrations
# Re-rode migrate:create
```

### rclone reauth (token expirou)

```bash
rclone config reconnect <DRIVE_REMOTE>:
```

### Restore quebra com "database being accessed"

O script já trata isso (para o app + termina sessões). Se ainda assim
falhar, manualmente:

```bash
docker stop <PROJETO>
docker exec <PROJETO>_db psql -U <DB_USER> -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='<PROJETO>';"
# Re-rode restore.sh
```

---

## 📊 Verificação periódica

Recomendado a cada 3 meses:

```bash
# 1. Validar integridade dos bundles
BUNDLE=$(ls -t backups/daily/<PROJETO>_*.tar | head -1)
TMP=$(mktemp -d)
tar -xf "$BUNDLE" -C "$TMP"
gunzip -t "$TMP"/db_*.sql.gz && echo "✅ SQL OK" || echo "❌ SQL CORROMPIDO"
tar -tzf "$TMP"/media_*.tar.gz > /dev/null && echo "✅ Media OK" || echo "❌ Media CORROMPIDO"
rm -rf "$TMP"

# 2. Confirmar último upload no Drive
rclone ls <DRIVE_REMOTE>:<DRIVE_FOLDER>/daily | head -3

# 3. Testar restore num ambiente isolado
# (subir docker-compose alternativo em portas diferentes e restaurar lá)
```

---

## 📦 Adições ao `.gitignore`

```gitignore
# Backups locais (bundles podem ter centenas de MB)
backups/
*.tar
*.sql
*.sql.gz
```

---

## ✅ Checklist final

- [ ] Substituí todos os placeholders `<PROJETO>`, `<PROJECT_ROOT>`, `<DB_NAME>`, `<DB_USER>`, `<MEDIA_VOLUME>`, `<DRIVE_REMOTE>`, `<DRIVE_FOLDER>`
- [ ] Copiei os 8 arquivos de código
- [ ] Atualizei `docker-compose.yml` com bind mounts e `BACKUP_ROOT`
- [ ] Atualizei `payload.config.ts` pra incluir `BackupConfig` em globals
- [ ] Instalei `rclone jq curl cron` na VPS
- [ ] Configurei rclone com `<DRIVE_REMOTE>` (token autorizado)
- [ ] Permissão 777 em `/app/src/migrations` e `/app/backups`
- [ ] Gerei e apliquei migration `add_backup_config`
- [ ] `chmod +x` nos 3 scripts
- [ ] Backup manual funcionou (`scripts/backup.sh`)
- [ ] Bundle apareceu no Drive (`rclone ls`)
- [ ] Cron diário (3h AM) e watcher (1min) ativos
- [ ] Drill de restore validado (estado A → backup → estado B → restore → estado A)
- [ ] `.gitignore` exclui `backups/`

---

**Implementação de referência:** Trakinagem Cine
**Tempo estimado:** 2-3h num projeto novo (1h só pra autorizar Drive, depende
do quanto a VPS é nova).

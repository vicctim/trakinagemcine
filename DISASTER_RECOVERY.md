# Disaster Recovery — Trakinagem Cine

Este documento descreve como restaurar o sistema do zero a partir de backups,
em caso de catástrofe (VPS apagada, corrupção de dados, migração de servidor).

---

## 📦 O que é incluído nos backups

Cada backup é um arquivo `.tar` único contendo:

| Componente | Conteúdo | Onde fica |
|---|---|---|
| `db_*.sql.gz` | Dump completo do PostgreSQL (schema + dados) | Banco `trakinagemcine` |
| `media_*.tar.gz` | Volume Docker com todas as imagens, vídeos e PDFs | Volume `trakinagemcine_media_data` |

O que **NÃO** é incluído (precisa estar em outro lugar):

- Código-fonte → **Git** (este repositório)
- Arquivo `.env` com segredos → **vault/cofre** (você gerencia separado)
- Configuração do rclone → `~/.config/rclone/rclone.conf` no servidor

---

## 🛡️ Estratégia de retenção

Configurável pelo admin em `/admin/globals/backup-config`. Padrão:

- **7 backups diários** (1 por dia, mantidos por 7 dias)
- **4 backups semanais** (1 por domingo, mantidos por 4 semanas)
- **6 backups mensais** (1 por dia 1, mantidos por 6 meses)

Total típico: ~17 backups simultâneos.

Cada categoria fica em sua subpasta:

```
backups/
├── daily/
├── weekly/
├── monthly/
├── backup.log
└── cron.log
```

Quando o Google Drive está ativo (`driveEnabled: true`), todo o diretório
`backups/` é sincronizado via `rclone sync` para a pasta configurada.

---

## ⚙️ Setup inicial (uma vez por servidor)

Veja a seção "Comandos de Setup" no Dashboard do admin
(`/admin` → seção "Backups e Disaster Recovery" → botão "📋 Comandos de Setup").

Resumo:

```bash
# 1. Instalar rclone + jq
sudo apt-get install -y rclone jq curl

# 2. Configurar Google Drive
rclone config
# Crie um remote chamado "gdrive-trakinagem"

# 3. Tornar scripts executáveis
chmod +x scripts/backup.sh scripts/restore.sh

# 4. Agendar via cron
crontab -e
# Adicione:
0 3 * * * /bin/bash /srv/clientes/victor/trakinagemcine/scripts/backup.sh >> /srv/clientes/victor/trakinagemcine/backups/cron.log 2>&1
```

---

## 🚨 Procedimento de Restore (Catástrofe Total)

Cenário: VPS perdida, precisa reconstruir tudo em outro servidor.

### Pré-requisitos

- Acesso a uma VPS Linux com Docker + Docker Compose instalados
- Acesso ao Git remoto (GitHub/etc)
- Acesso ao Google Drive onde os backups estão
- O arquivo `.env` original (segredos do banco, Payload secret)

### Passo a passo

```bash
# 1. Clonar o repositório
git clone <repo-url> /srv/clientes/victor/trakinagemcine
cd /srv/clientes/victor/trakinagemcine

# 2. Restaurar arquivo .env (do seu cofre/vault)
cp /caminho/para/seu/.env.backup .env

# 3. Instalar rclone na VPS nova e reconfigurar
sudo apt-get install -y rclone jq curl
rclone config  # criar remote gdrive-trakinagem novamente

# 4. Baixar backups do Google Drive
mkdir -p backups/daily
rclone copy gdrive-trakinagem:backups/trakinagemcine ./backups

# 5. Subir os containers (DB + app)
docker compose up -d --build
# Aguarde DB ficar saudável (15-30s)
docker compose ps  # verificar healthcheck do db

# 6. Restaurar do backup mais recente
chmod +x scripts/restore.sh
LATEST=$(ls -t backups/daily/trakinagemcine_*.tar | head -1)
/bin/bash scripts/restore.sh "$LATEST"
# Quando perguntado, digite SIM

# 7. Verificar
curl http://localhost:3006/api/posts?limit=1
# Acesse: http://seu-dominio/admin
```

---

## 🔍 Verificação de integridade dos backups

Periodicamente, valide que os backups estão funcionais:

```bash
# Listar bundles disponíveis
ls -lh backups/daily/

# Testar conteúdo de um bundle (sem aplicar)
BUNDLE=$(ls -t backups/daily/trakinagemcine_*.tar | head -1)
TMP=$(mktemp -d)
tar -tf "$BUNDLE"  # deve listar db_*.sql.gz e media_*.tar.gz

# Validar integridade do dump SQL
tar -xf "$BUNDLE" -C "$TMP"
gunzip -t "$TMP"/db_*.sql.gz && echo "✅ SQL OK" || echo "❌ SQL CORROMPIDO"

# Validar tarball da mídia
tar -tzf "$TMP"/media_*.tar.gz > /dev/null && echo "✅ Media OK" || echo "❌ Media CORROMPIDO"

rm -rf "$TMP"
```

---

## 🧪 Drill de Recuperação (recomendado a cada 3 meses)

Faça um teste de restore em ambiente isolado:

```bash
# Crie um docker-compose alternativo apontando para volumes/portas diferentes
# Ex: db_test, app_test em portas 4006, 5432
# Restaure ali e verifique que o site funciona normalmente
```

---

## 📞 Troubleshooting

### Backup manual falha
```bash
# Ver logs detalhados
tail -100 /srv/clientes/victor/trakinagemcine/backups/backup.log

# Validar acesso aos containers
docker exec trakinagemcine_db pg_isready
docker volume inspect trakinagemcine_media_data
```

### Cron não está rodando
```bash
# Verificar agendamento
crontab -l

# Verificar logs do cron
tail -50 /srv/clientes/victor/trakinagemcine/backups/cron.log

# Verificar serviço cron ativo
systemctl status cron  # ou crond
```

### rclone falha no upload
```bash
# Reautorizar Drive
rclone config reconnect gdrive-trakinagem:

# Testar conectividade
rclone lsd gdrive-trakinagem:
```

### Status no Dashboard não atualiza
O script `backup.sh` tenta chamar `POST /api/admin/backup/status` em `localhost:3006`.
Verifique:
- O app está rodando (`docker compose ps`)
- O endpoint está acessível: `curl http://localhost:3006/api/globals/backup-config`
- Variável `SITE_API` no script aponta para a URL certa

---

## 🔁 Replicar para outros projetos (template)

Os scripts foram pensados para serem facilmente adaptáveis. Para usar em outro
projeto, edite os valores no topo do `backup.sh`:

```bash
PROJECT_ROOT="/srv/clientes/victor/SEU_PROJETO"
DB_CONTAINER="seuprojeto_db"
APP_CONTAINER="seuprojeto"
DB_NAME="seuprojeto"
MEDIA_VOLUME="seuprojeto_media_data"
```

E ajuste o `BackupConfig.ts` (mesmo arquivo, só renomeie a global se quiser).
A configuração via painel admin (retenção, Drive) já funciona automaticamente.

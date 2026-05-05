#!/bin/bash
# ============================================================
# Trakinagem Cine — Backup completo (DB + Media)
# ============================================================
# Faz dump do PostgreSQL + tarball do volume de mídia,
# aplica retenção configurada (diário/semanal/mensal) e
# opcionalmente envia para Google Drive via rclone.
#
# Uso:
#   /bin/bash /srv/clientes/victor/trakinagemcine/scripts/backup.sh
#
# Cron (3h da manhã todo dia):
#   0 3 * * * /bin/bash /srv/clientes/victor/trakinagemcine/scripts/backup.sh >> /srv/clientes/victor/trakinagemcine/backups/cron.log 2>&1
# ============================================================

set -euo pipefail

# ─── Configurações (ajuste se necessário) ───────────────────
PROJECT_ROOT="/srv/clientes/victor/trakinagemcine"
BACKUP_DIR="${PROJECT_ROOT}/backups"
DB_CONTAINER="trakinagemcine_db"
APP_CONTAINER="trakinagemcine"
DB_NAME="${DB_NAME:-trakinagemcine}"
DB_USER="${DB_USER:-trakinagem}"
MEDIA_VOLUME="trakinagemcine_media_data"

# Site URL (para chamar API e atualizar status no admin)
SITE_API="${SITE_API:-http://localhost:3006}"

DATE=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)   # 1=Mon..7=Sun
DAY_OF_MONTH=$(date +%d)

# Categoria do backup (daily / weekly / monthly)
CATEGORY="daily"
[ "$DAY_OF_WEEK" = "7" ] && CATEGORY="weekly"
[ "$DAY_OF_MONTH" = "01" ] && CATEGORY="monthly"

DAILY_DIR="${BACKUP_DIR}/daily"
WEEKLY_DIR="${BACKUP_DIR}/weekly"
MONTHLY_DIR="${BACKUP_DIR}/monthly"
LOG_FILE="${BACKUP_DIR}/backup.log"

mkdir -p "$DAILY_DIR" "$WEEKLY_DIR" "$MONTHLY_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

# ─── Buscar config do painel admin ──────────────────────────
# Padrões caso a API não responda
RETENTION_DAILY=7
RETENTION_WEEKLY=4
RETENTION_MONTHLY=6
DRIVE_ENABLED="false"
DRIVE_REMOTE="gdrive-trakinagem"
DRIVE_FOLDER="backups/trakinagemcine"

if command -v curl >/dev/null && command -v jq >/dev/null; then
  CFG_JSON=$(curl -sf "${SITE_API}/api/globals/backup-config?depth=0" 2>/dev/null || echo '{}')
  if [ -n "$CFG_JSON" ] && [ "$CFG_JSON" != "{}" ]; then
    RETENTION_DAILY=$(echo "$CFG_JSON" | jq -r '.retentionDaily // 7')
    RETENTION_WEEKLY=$(echo "$CFG_JSON" | jq -r '.retentionWeekly // 4')
    RETENTION_MONTHLY=$(echo "$CFG_JSON" | jq -r '.retentionMonthly // 6')
    DRIVE_ENABLED=$(echo "$CFG_JSON" | jq -r '.driveEnabled // false')
    DRIVE_REMOTE=$(echo "$CFG_JSON" | jq -r '.driveRemoteName // "gdrive-trakinagem"')
    DRIVE_FOLDER=$(echo "$CFG_JSON" | jq -r '.driveFolder // "backups/trakinagemcine"')
    log "📋 Config carregada do admin: retention=${RETENTION_DAILY}/${RETENTION_WEEKLY}/${RETENTION_MONTHLY} drive=${DRIVE_ENABLED}"
  fi
fi

# ─── Atualizar status: running ──────────────────────────────
update_status() {
  local status="$1"
  local message="$2"
  local size="${3:-0}"
  if command -v curl >/dev/null; then
    curl -sf -X POST "${SITE_API}/api/admin/backup/status" \
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
BUNDLE="${DAILY_DIR}/trakinagemcine_${DATE}.tar"
tar -cf "$BUNDLE" -C "$DAILY_DIR" "db_${DATE}.sql.gz" "media_${DATE}.tar.gz" 2>/dev/null || true
rm -f "${DAILY_DIR}/db_${DATE}.sql.gz" "${DAILY_DIR}/media_${DATE}.tar.gz"
TOTAL_SIZE=$(du -sb "$BUNDLE" | cut -f1)
log "📦 Bundle: ${BUNDLE} ($(numfmt --to=iec ${TOTAL_SIZE}))"

# ─── 4. Cópia para weekly/monthly se aplicável ──────────────
if [ "$CATEGORY" = "weekly" ]; then
  cp "$BUNDLE" "${WEEKLY_DIR}/"
  log "📅 Copiado para weekly/"
elif [ "$CATEGORY" = "monthly" ]; then
  cp "$BUNDLE" "${MONTHLY_DIR}/"
  log "📆 Copiado para monthly/"
fi

# ─── 5. Aplicar retenção ────────────────────────────────────
prune() {
  local dir="$1"
  local keep="$2"
  cd "$dir"
  ls -t trakinagemcine_*.tar 2>/dev/null | tail -n +$((keep + 1)) | while read -r f; do
    rm -f "$f"
    log "🗑️  Removido: ${dir}/$f"
  done
  cd - >/dev/null
}
prune "$DAILY_DIR" "$RETENTION_DAILY"
prune "$WEEKLY_DIR" "$RETENTION_WEEKLY"
prune "$MONTHLY_DIR" "$RETENTION_MONTHLY"

# ─── 6. Upload para Google Drive (rclone) ───────────────────
if [ "$DRIVE_ENABLED" = "true" ]; then
  if command -v rclone >/dev/null; then
    log "☁️  Enviando para Google Drive (${DRIVE_REMOTE}:${DRIVE_FOLDER})..."
    if rclone sync "$BACKUP_DIR" "${DRIVE_REMOTE}:${DRIVE_FOLDER}" \
      --exclude "*.log" --exclude "cron.log" \
      --transfers 2 --checkers 4 \
      --log-file "$LOG_FILE" --log-level INFO; then
      log "  ✅ Upload concluído"
    else
      log "  ⚠ Falha no upload para Drive (backup local OK)"
    fi
  else
    log "  ⚠ rclone não instalado — pulando upload"
  fi
fi

log "✔ Backup concluído com sucesso (${CATEGORY})"
update_status "success" "Backup ${CATEGORY} concluído com sucesso." "$TOTAL_SIZE"

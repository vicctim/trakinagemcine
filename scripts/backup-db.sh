#!/bin/bash
# ============================================================
# Trakinagem Cine — Backup PostgreSQL diário
# Localização: /srv/clientes/victor/trakinagemcine/scripts/backup-db.sh
# Cron recomendado: 0 3 * * * /bin/bash /srv/clientes/victor/trakinagemcine/scripts/backup-db.sh
# ============================================================

set -euo pipefail

BACKUP_DIR="/srv/clientes/victor/trakinagemcine/backups"
CONTAINER="trakinagemcine_db"
DB_NAME="trakinagemcine"
DB_USER="trakinagem"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup.log"

mkdir -p "$BACKUP_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log "🗄️  Iniciando backup de ${DB_NAME}..."

# Dump + gzip direto
if docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"; then
  SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
  log "✅ Backup criado: ${BACKUP_FILE} (${SIZE})"
else
  log "❌ FALHA no backup!"
  exit 1
fi

# Remove arquivos mais antigos que RETENTION_DAYS
REMOVED=$(find "$BACKUP_DIR" -name "*.sql.gz" -mtime +${RETENTION_DAYS} -print -delete | wc -l)
if [ "$REMOVED" -gt 0 ]; then
  log "🗑️  ${REMOVED} backup(s) antigo(s) removido(s) (>${RETENTION_DAYS} dias)"
fi

log "✔ Backup concluído com sucesso."

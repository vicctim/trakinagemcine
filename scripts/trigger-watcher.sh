#!/bin/bash
# ============================================================
# Trigger watcher — dispara backup quando admin solicita
# ============================================================
# A rota POST /api/admin/backup cria o arquivo `.backup-requested`
# em `backups/`. Este script (chamado por cron de 1 minuto)
# detecta o arquivo, dispara o backup e remove o trigger.
#
# Cron sugerido (a cada minuto):
#   * * * * * /bin/bash /srv/clientes/victor/trakinagemcine/scripts/trigger-watcher.sh >> /srv/clientes/victor/trakinagemcine/backups/cron.log 2>&1
# ============================================================

set -euo pipefail

PROJECT_ROOT="/srv/clientes/victor/trakinagemcine"
TRIGGER_FILE="${PROJECT_ROOT}/backups/.backup-requested"
BACKUP_SCRIPT="${PROJECT_ROOT}/scripts/backup.sh"
LOCK_FILE="${PROJECT_ROOT}/backups/.backup-running"

# Sai silenciosamente se não tem trigger
[ -f "$TRIGGER_FILE" ] || exit 0

# Evita backup concorrente (se já tem um rodando)
if [ -f "$LOCK_FILE" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⏭️  Trigger detectado mas já há backup em execução. Aguardando próximo ciclo."
  exit 0
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔔 Trigger detectado. Iniciando backup..."
touch "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

# Remove trigger antes de rodar — se aparecer outro durante o backup, será atendido na próxima
rm -f "$TRIGGER_FILE"

/bin/bash "$BACKUP_SCRIPT"

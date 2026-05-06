#!/bin/bash
# ============================================================
# Trakinagem Cine — Restore (DB + Media)
# ============================================================
# Restaura um backup criado pelo scripts/backup.sh.
#
# Uso:
#   /bin/bash scripts/restore.sh <caminho-do-bundle.tar>
#
# Exemplo:
#   /bin/bash scripts/restore.sh /srv/clientes/victor/trakinagemcine/backups/daily/trakinagemcine_20260505_030000.tar
#
# CUIDADO: este script SUBSTITUI o banco de dados e a mídia atuais.
# Confirme antes de executar em produção.
# ============================================================

set -euo pipefail

PROJECT_ROOT="/srv/clientes/victor/trakinagemcine"
DB_CONTAINER="trakinagemcine_db"
APP_CONTAINER="trakinagemcine"
DB_NAME="${DB_NAME:-trakinagemcine}"
DB_USER="${DB_USER:-trakinagem}"
MEDIA_VOLUME="trakinagemcine_media_data"

if [ $# -lt 1 ]; then
  echo "❌ Uso: $0 <caminho-do-bundle.tar>"
  echo ""
  echo "Backups disponíveis:"
  find "${PROJECT_ROOT}/backups" -name "trakinagemcine_*.tar" -type f 2>/dev/null | sort -r | head -10
  exit 1
fi

BUNDLE="$1"
if [ ! -f "$BUNDLE" ]; then
  echo "❌ Bundle não encontrado: $BUNDLE"
  exit 1
fi

echo "⚠️  ATENÇÃO: O conteúdo atual do banco e da mídia será APAGADO e substituído."
echo "   Bundle: $BUNDLE"
echo "   DB:     $DB_NAME ($DB_CONTAINER)"
echo "   Media:  $MEDIA_VOLUME"
echo ""
read -p "Digite 'SIM' para confirmar: " CONFIRM
[ "$CONFIRM" = "SIM" ] || { echo "Cancelado."; exit 0; }

WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

echo "📦 Extraindo bundle..."
tar -xf "$BUNDLE" -C "$WORK_DIR"
DB_GZ=$(ls "$WORK_DIR"/db_*.sql.gz 2>/dev/null | head -1)
MEDIA_GZ=$(ls "$WORK_DIR"/media_*.tar.gz 2>/dev/null | head -1)

if [ -z "$DB_GZ" ]; then
  echo "❌ Não foi encontrado db_*.sql.gz no bundle"
  exit 1
fi

# ─── Restore do PostgreSQL ──────────────────────────────────
echo "🗄️  Restaurando banco de dados..."

# Parar app temporariamente pra liberar conexões
echo "  ⏸️  Pausando container do app..."
docker stop "$APP_CONTAINER" >/dev/null 2>&1 || true

# Forçar terminação de sessões remanescentes
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${DB_NAME}' AND pid <> pg_backend_pid();" >/dev/null

docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE ${DB_NAME};"
gunzip -c "$DB_GZ" | docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" >/dev/null
echo "  ✅ DB restaurado"

# ─── Restore da Mídia ───────────────────────────────────────
if [ -n "$MEDIA_GZ" ]; then
  echo "🖼️  Restaurando volume de mídia..."
  docker run --rm \
    -v "${MEDIA_VOLUME}:/data" \
    -v "$(dirname "$MEDIA_GZ"):/backup:ro" \
    alpine sh -c "rm -rf /data/* && tar xzf /backup/$(basename "$MEDIA_GZ") -C /data"
  echo "  ✅ Mídia restaurada"
fi

# ─── Reiniciar app (forçar recarregar config/conexões) ──────
echo "🔄 Iniciando app..."
docker start "$APP_CONTAINER" >/dev/null 2>&1 || docker compose -f "${PROJECT_ROOT}/docker-compose.yml" up -d app >/dev/null
echo "  ✅ App iniciado"

echo ""
echo "✔ Restore concluído com sucesso."
echo "   Acesse: http://trakinagemcine.local/admin"

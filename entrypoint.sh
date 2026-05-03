#!/bin/sh
set -e

echo "Running Payload migrations..."
npx payload migrate
echo "Migrations complete. Starting app..."

export HOSTNAME="0.0.0.0"
exec node server.js

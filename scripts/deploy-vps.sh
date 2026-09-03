#!/usr/bin/env bash
# Production deploy for je4ndev.com. Run on luna-vps only.
set -euo pipefail

if [[ "$(hostname)" != "vmi3232216" ]]; then
  echo "Refusing to run outside luna-vps (hostname=$(hostname))" >&2
  exit 1
fi

ROOT="/home/jean/jeanvargas.dev"
cd "$ROOT"

git fetch origin
git checkout main
git pull --ff-only origin main

npm ci
npm run gate

systemctl --user stop jeanvargas-dev.service
npm run build
systemctl --user start jeanvargas-dev.service

sleep 2
systemctl --user is-active jeanvargas-dev.service
curl -fsS --max-time 10 "http://127.0.0.1:3002/api/health"
echo
curl -fsS --max-time 10 "http://127.0.0.1:3002/pt" | grep -q "Jean Carlos Vargas | JE4NDEV"
echo "deploy ok $(git rev-parse --short HEAD)"

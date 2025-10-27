#!/usr/bin/env bash
# Deploy built site to a remote server over SSH (rsync)
# Usage: ./scripts/deploy-ssh.sh
# Prompts for host (default 192.168.237.50), port (default 22), username, and remote path (default /var/www/html)

set -euo pipefail

BUILD_CMD="npm run build --silent"
RSYNC_OPTS='-avz --delete --chmod=Du+rX,Fu+rw'

read -r -p "Remote host [192.168.237.50]: " REMOTE_HOST
REMOTE_HOST=${REMOTE_HOST:-192.168.237.50}
read -r -p "SSH port [22]: " SSH_PORT
SSH_PORT=${SSH_PORT:-22}
read -r -p "Remote user [root]: " REMOTE_USER
REMOTE_USER=${REMOTE_USER:-root}
read -r -p "Remote path [/var/www/html]: " REMOTE_PATH
REMOTE_PATH=${REMOTE_PATH:-/var/www/html}

echo "Building site..."
$BUILD_CMD
if [ ! -d dist ]; then
  echo "Build output 'dist/' not found. Aborting." >&2
  exit 1
fi

echo "Deploying to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH} (ssh port ${SSH_PORT})"

# Ensure remote path exists (attempt to create it using ssh)
ssh -p "${SSH_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p '${REMOTE_PATH}'" || true

# Rsync to remote
rsync ${RSYNC_OPTS} -e "ssh -p ${SSH_PORT}" dist/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"

echo "Files synced. If necessary, adjust ownership/permissions on the remote host."

cat <<'EOF'
If your Nginx requires specific ownership (e.g., www-data), run on the remote host:
  sudo chown -R www-data:www-data REMOTE_PATH
  sudo systemctl reload nginx
EOF

echo "Deploy complete."

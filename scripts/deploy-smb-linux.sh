#!/usr/bin/env bash
# Deploy built site to an SMB share on Linux (mount.cifs)
# Usage: ./scripts/deploy-smb-linux.sh

set -euo pipefail

# Configuration (update if needed)
REMOTE_HOST="192.168.237.50"
REMOTE_SHARE="web"
MOUNT_POINT_DEFAULT="/mnt/drfisher_web"
BUILD_CMD="npm run build --silent"
RSYNC_OPTS='-av --delete --chmod=Du+rX,Fu+rw'

cleanup() {
  if mountpoint -q "${MOUNT_POINT}"; then
    echo "Unmounting ${MOUNT_POINT}..."
    sudo umount "${MOUNT_POINT}" || true
  fi
}
trap cleanup EXIT

read -r -p "Mount point [${MOUNT_POINT_DEFAULT}]: " MOUNT_POINT
MOUNT_POINT=${MOUNT_POINT:-$MOUNT_POINT_DEFAULT}

echo "Building site..."
$BUILD_CMD
if [ ! -d dist ]; then
  echo "Build output 'dist/' not found. Aborting." >&2
  exit 1
fi

read -r -p "SMB username: " SMB_USER
read -r -s -p "SMB password: " SMB_PASS
printf "\n"

if [ ! -d "${MOUNT_POINT}" ]; then
  sudo mkdir -p "${MOUNT_POINT}"
  sudo chown $(id -u):$(id -g) "${MOUNT_POINT}"
fi

echo "Mounting //${REMOTE_HOST}/${REMOTE_SHARE} -> ${MOUNT_POINT}"
sudo mount.cifs "//${REMOTE_HOST}/${REMOTE_SHARE}" "${MOUNT_POINT}" -o username=${SMB_USER},password=${SMB_PASS},rw,vers=3.0

echo "Syncing dist/ -> ${MOUNT_POINT}/"
rsync ${RSYNC_OPTS} dist/ "${MOUNT_POINT}/"

echo "Deploy complete. Cleaning up mount..."
cleanup

echo "Done. Your site should be available from the SMB host's webroot served by Nginx."

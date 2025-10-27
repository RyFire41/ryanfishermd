#!/bin/zsh
# Deploy built site to an SMB share (macOS)
# Usage: ./scripts/deploy-smb.sh 
# The script will prompt for SMB credentials and mount point.

set -euo pipefail

# Config
REMOTE_HOST="192.168.237.50"
REMOTE_SHARE="web"
MOUNT_POINT_DEFAULT="/Volumes/drfisher_web"
BUILD_CMD="npm run build --silent"
RSYNC_OPTS='-av --delete --chmod=Du+rX,Fu+rw'

# Helpers
function cleanup() {
  if mount | grep -q "${MOUNT_POINT}" 2>/dev/null; then
    echo "Unmounting ${MOUNT_POINT}..."
    umount "${MOUNT_POINT}" 2>/dev/null || diskutil unmount "${MOUNT_POINT}" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

# Ask for mount point
read -r -p "Mount point [${MOUNT_POINT_DEFAULT}]: " MOUNT_POINT
MOUNT_POINT=${MOUNT_POINT:-$MOUNT_POINT_DEFAULT}

# Ensure build exists
echo "Building site..."
$BUILD_CMD
if [ ! -d dist ]; then
  echo "Build output 'dist/' not found. Aborting." >&2
  exit 1
fi

# Prompt for SMB credentials
read -r -p "SMB username: " SMB_USER
stty -echo
read -r -p "SMB password: " SMB_PASS
stty echo
printf "\n"

# Create mount point
if [ ! -d "${MOUNT_POINT}" ]; then
  mkdir -p "${MOUNT_POINT}"
fi

# Mount the share (macOS mount_smbfs)
MOUNT_URL="//$SMB_USER:$SMB_PASS@${REMOTE_HOST}/${REMOTE_SHARE}"

echo "Mounting ${MOUNT_URL} -> ${MOUNT_POINT}"
mount_smbfs "${MOUNT_URL}" "${MOUNT_POINT}"

# Copy files (rsync)
echo "Syncing dist/ -> ${MOUNT_POINT}/"
rsync $RSYNC_OPTS dist/ "${MOUNT_POINT}/"

# Optionally set ownership/permissions if needed (requires sudo)
# echo "Setting permissions..."
# sudo chown -R www-data:www-data "${MOUNT_POINT}" || true

echo "Deploy complete. Unmounting..."
cleanup

echo "Done. Your site should be available from the SMB host's webroot."

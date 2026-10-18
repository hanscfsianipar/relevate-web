#!/bin/sh
# Mengaktifkan hook dari folder .githooks (ikut repo).
# Dipanggil otomatis lewat `npm install` (script prepare).

set -e

cd "$(git rev-parse --show-toplevel 2>/dev/null || true)"

if [ ! -d .git ]; then
  echo "Bukan repo git, hook dilewati."
  exit 0
fi

chmod +x .githooks/pre-commit 2>/dev/null || true
git config core.hooksPath .githooks

echo "Git hooks aktif: .githooks/pre-commit"

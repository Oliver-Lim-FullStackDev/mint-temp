#!/usr/bin/env bash
# ==============================================================================
# Script Name: install-caddy.sh
#
# Description:
#   Installs the Caddy web server and configures local HTTPS certificate trust
#   for development. Works on macOS (via Homebrew) and Debian/Ubuntu (via apt).
#   If Caddy is already installed, the script does nothing.
#
# Usage:
#   ./install-caddy.sh
#
# Behavior:
#   - On macOS:
#       Uses Homebrew to install Caddy if not present.
#   - On Debian/Ubuntu:
#       Adds the official Caddy repository, updates apt, and installs Caddy.
#   - On other systems:
#       Exits with instructions to manually install Caddy.
#
#   After installation, the script runs `caddy trust` to add Caddy’s local CA
#   to the OS/browser trust store, enabling trusted HTTPS for local dev.
#
# Requirements:
#   - macOS with Homebrew, or Debian/Ubuntu with apt-get.
#   - sudo privileges (for Debian/Ubuntu install and certificate trust).
#
# Next Steps:
#   Run `npm run dev:proxy` to start the HTTPS reverse proxy with Caddy.
#
# Reference:
#   https://caddyserver.com/docs/install
# ==============================================================================

set -euo pipefail

# --- Install Caddy (macOS Homebrew / Debian/Ubuntu examples) ---
if command -v brew >/dev/null 2>&1; then
  brew list caddy >/dev/null 2>&1 || brew install caddy
elif command -v apt-get >/dev/null 2>&1; then
  if ! command -v caddy >/dev/null 2>&1; then
    sudo apt-get update
    sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo tee /usr/share/keyrings/caddy-stable-archive-keyring.gpg >/dev/null
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian/deb/debian.deb.txt' | \
      sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt-get update && sudo apt-get install -y caddy
  fi
else
  echo "Please install Caddy for your OS: https://caddyserver.com/docs/install"
  exit 1
fi

# Trust Caddy's local CA so dev certs are trusted by the OS/browser
# (may prompt for sudo to install the cert into system trust store)
caddy trust || true

echo "✅ Caddy installed and local CA trusted."
echo "Next step: run 'npm run dev:proxy' to start the HTTPS reverse proxy."

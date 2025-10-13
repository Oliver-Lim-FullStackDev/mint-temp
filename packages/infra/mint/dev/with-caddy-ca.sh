#!/usr/bin/env bash
#!/usr/bin/env bash
# ==============================================================================
# Script Name: with-caddy-ca.sh
#
# Description:
#   Ensures Node.js trusts Caddy’s local development CA certificate so that
#   HTTPS requests to domains like https://mint.dev work in dev mode.
#
# Usage:
#   ./with-caddy-ca.sh [command]
#
# Behavior:
#   - Detects the location of Caddy’s local root CA certificate:
#       macOS:  ~/Library/Application Support/Caddy/pki/authorities/local/root.crt
#       Linux:  ~/.local/share/caddy/pki/authorities/local/root.crt
#
#   - If the CA certificate is missing:
#       Attempts to run `caddy trust` (may prompt for sudo).
#       Exits with an error if the CA is still missing.
#
#   - Exports environment variables for Node.js:
#       NODE_EXTRA_CA_CERTS → path to the Caddy root CA
#       NODE_OPTIONS       → appends `--use-openssl-ca`
#
#   - If no command is passed, defaults to:
#       next dev -H 127.0.0.1 -p 3000
#
# Examples:
#   # Start Next.js dev server with trusted Caddy certs
#   ./with-caddy-ca.sh
#
#   # Run another command (e.g. Node script) with Caddy CA trusted
#   ./with-caddy-ca.sh node server.js
#
# Requirements:
#   - Caddy installed and local CA trusted (`caddy trust`)
#   - Node.js
#
# Reference:
#   https://caddyserver.com/docs/caddyfile
# ==============================================================================

set -euo pipefail

# Pick Caddy local CA path by OS
if [[ "$(uname -s)" == "Darwin" ]]; then
  CA="$HOME/Library/Application Support/Caddy/pki/authorities/local/root.crt"
else
  CA="$HOME/.local/share/caddy/pki/authorities/local/root.crt"
fi

# If the CA isn't there, try to install/trust it
if [[ ! -f "$CA" ]]; then
  echo "Caddy local root CA not found at:"
  echo "  $CA"
  if command -v caddy >/dev/null 2>&1; then
    echo "Trying 'caddy trust' (may prompt for sudo)…"
    caddy trust || true
  fi
fi

# Bail if still missing
if [[ ! -f "$CA" ]]; then
  echo "❌ Caddy root CA still missing. Make sure Caddy is installed and run:  caddy trust"
  exit 1
fi

# Export envs for Node to trust the CA
export NODE_EXTRA_CA_CERTS="$CA"
# Keep existing NODE_OPTIONS and add OpenSSL CA flag
export NODE_OPTIONS="${NODE_OPTIONS:-} --use-openssl-ca"

# Default command if none provided
if [[ $# -eq 0 ]]; then
  set -- next dev -H 127.0.0.1 -p 3000
fi

echo "✔ Using NODE_EXTRA_CA_CERTS=$NODE_EXTRA_CA_CERTS"
exec "$@"

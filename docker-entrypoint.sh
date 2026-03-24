#!/bin/sh
# File: docker-entrypoint.sh
set -eu

# Provide defaults
: "${PORT:=7001}"
: "${NODE_ENV:=production}"
: "${ENVM:=dev}"
: "${DEBUG_MODE:=false}"

# Start building argv, keep deterministic ordering
set -- node server.js --ssl --ssl-key ssl/backbone.key --ssl-cert ssl/backbone.crt
set -- "$@" --port "$PORT" --configuration "$NODE_ENV"

# Add vault-related args only if provided (check multiple common env names)
if [ -n "${VAULT_URL:-}" ]; then
  set -- "$@" --vaultUrl "$VAULT_URL"
fi

if [ -n "${VAULT_TOKEN:-}" ]; then
  set -- "$@" --vaultToken "$VAULT_TOKEN"
fi

if [ -n "${VAULT_PATH:-}" ] ; then
  # If app expects a separate --vaultPath flag, include it too (only when set)
  set -- "$@" --vaultPath "$VAULT_PATH""$ENVM"
fi

# Always pass DEBUG_MODE and ENVM as explicit strings (avoid bare true/false being treated as flags)
set -- "$@" --DEBUG_MODE "$DEBUG_MODE" --ENVM "$ENVM"

# print the value of the final command for logging/debugging purposes
echo "Executing command: $*"
# Execute the final command
exec "$@"

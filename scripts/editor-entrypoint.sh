#!/bin/bash
set -e



cleanup() {
  echo "Shutting down..."
  kill "$APP_PID" "$EXPORTER_PID" 2>/dev/null
  wait "$APP_PID" "$EXPORTER_PID" 2>/dev/null
  exit 0
}

trap cleanup SIGTERM SIGINT

node build/index.js &
APP_PID=$!

node packages/maniok-exporter/dist/index.js &
EXPORTER_PID=$!

# Exit if either process dies
wait -n "$APP_PID" "$EXPORTER_PID"
EXIT_CODE=$?

echo "A process exited with code $EXIT_CODE, shutting down..." >&2
cleanup

#!/bin/bash

set -e

# Check WORKSPACE_PATH
if [[ -z "$WORKSPACE_PATH" || ! -d "$WORKSPACE_PATH" || ! -f "$WORKSPACE_PATH/workspace.dsl" ]]; then
  echo "[ERROR] Directory /user/workspace must be mapped to a local directory containing a structurizr workspace." >&2
  echo "Usage:"
  echo "  docker run -t --rm -p 8080:8080 -v <path/to/workspace>:/usr/workspace  maniokeditor:latest" >&2
  echo "Make sure <path/to/workspace> contains a workspace.dsl file." >&2
  exit 1
fi



cleanup() {
  echo "Shutting down..."
  kill "$APP_PID" "$EXPORTER_PID" 2>/dev/null
  wait "$APP_PID" "$EXPORTER_PID" 2>/dev/null
  exit 0
}

trap cleanup SIGTERM SIGINT

node build/index.js &
APP_PID=$!

node packages/maniok-exporter/dist/main.js &
EXPORTER_PID=$!

# Exit if either process dies
wait -n "$APP_PID" "$EXPORTER_PID"
EXIT_CODE=$?

echo "A process exited with code $EXIT_CODE, shutting down..." >&2
cleanup

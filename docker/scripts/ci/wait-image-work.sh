#!/usr/bin/env bash
#
# Waits for the work started by start-image-work.sh, prints each task's log in
# a collapsible group and fails if any task failed.
set -uo pipefail

dir="${RUNNER_TEMP:-/tmp}/image-work"
timeout_seconds=900
status=0

for log in "$dir"/*.log; do
  name=$(basename "$log" .log)
  waited=0
  until [ -f "$dir/$name.exit" ]; do
    if [ "$waited" -ge "$timeout_seconds" ]; then
      echo "::error::$name did not finish within ${timeout_seconds}s"
      status=1
      break
    fi
    sleep 2
    waited=$((waited + 2))
  done

  echo "::group::$name"
  cat "$log"
  echo "::endgroup::"

  if [ -f "$dir/$name.exit" ] && [ "$(cat "$dir/$name.exit")" != "0" ]; then
    echo "::error::$name failed"
    status=1
  fi
done

exit "$status"

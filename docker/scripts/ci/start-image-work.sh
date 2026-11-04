#!/usr/bin/env bash
#
# Starts the slow Docker image work in the background so it overlaps with the
# npm and Playwright installs. wait-image-work.sh collects the results.
#
# Builds use `docker compose build` so the images match what `docker compose up`
# uses (target: development). Pulls skip services with a build section: the
# frontend image may only exist locally, so it is only pulled when there is no
# depends-on checkout to build it from.
#
# Env: NRF_BACKEND, NRF_BACKEND_PATH, NRF_IMPACT_ASSESSOR_PATH (read by compose.yml)
#      NRF_FRONTEND_PATH (optional) - a depends-on frontend checkout to build
set -euo pipefail

dir="${RUNNER_TEMP:-/tmp}/image-work"
rm -rf "$dir"
mkdir -p "$dir"

start() {
  local name=$1
  shift
  # $0 inside bash -c is the exit-code file; the rest is the command to run
  nohup bash -c '"$@"; echo $? > "$0"' "$dir/$name.exit" "$@" > "$dir/$name.log" 2>&1 &
}

# Pull, then start the infrastructure containers so their healthchecks run
# while the app images build. The localstack init scripts must be executable.
pull_and_start_infra() {
  docker compose pull --ignore-buildable
  if [ -z "${NRF_FRONTEND_PATH:-}" ]; then
    docker compose pull nrf-frontend
  fi
  chmod +x docker/scripts/localstack/*.sh
  docker compose up -d localstack redis postgres mongodb defra-id-stub cdp-uploader
}

export -f pull_and_start_infra
start pull pull_and_start_infra
start build docker compose -f compose.yml -f docker/compose.ci.yml build nrf-backend nrf-impact-assessor impact-assessor-migration

if [ -n "${NRF_FRONTEND_PATH:-}" ]; then
  start frontend docker build --load \
    --cache-from type=gha,scope=nrf-frontend \
    --cache-to type=gha,scope=nrf-frontend,mode=max \
    -t defradigital/nrf-frontend:pr-build "$NRF_FRONTEND_PATH"
fi

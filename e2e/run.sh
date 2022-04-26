#!/usr/bin/env bash

if [ -z "$(command -v docker)" ]; then
    echo "ERROR: docker needs to be installed!"
    exit 1
fi

URL="https://ngrx-store-storagesync.firebaseapp.com"
ROBOT_OPTIONS="-i default"

if [ -n "${1}" ]; then
    ROBOT_OPTIONS="-i ${1}"
fi

if [ -n "$BASE_URL" ]; then
    URL="${BASE_URL}"
fi

e2e_dir="$(dirname "$(which "$0")")"

echo "=============================================================================="
echo "URL: ${URL}"
echo "OPTIONS: ${ROBOT_OPTIONS}"
echo "=============================================================================="

docker run --rm -v $e2e_dir/reports:/opt/robotframework/reports:Z \
    -v $e2e_dir/tests:/opt/robotframework/tests:Z \
    -e BASE_URL="${URL}" \
    -e ROBOT_OPTIONS="${ROBOT_OPTIONS}" \
    ppodgorsek/robot-framework:3.8.0

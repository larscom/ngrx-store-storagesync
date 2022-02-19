#!/usr/bin/env bash

if [ -z "$(command -v docker)" ]; then
    echo "ERROR: docker needs to be installed!"
    exit 1
fi

if [ -z "${1}" ]; then
    export ROBOT_OPTIONS="-i default"
else
    export ROBOT_OPTIONS="-i ${1}"
fi

e2e_dir="$(dirname "$(which "$0")")"

docker run -e ROBOT_OPTIONS="${ROBOT_OPTIONS}" -v $e2e_dir/reports:/opt/robotframework/reports:Z -v $e2e_dir/tests:/opt/robotframework/tests:Z ppodgorsek/robot-framework:3.8.0

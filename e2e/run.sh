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

docker run -e ROBOT_OPTIONS="${ROBOT_OPTIONS}" -v $(pwd)/reports:/opt/robotframework/reports:Z -v $(pwd)/tests:/opt/robotframework/tests:Z ppodgorsek/robot-framework:3.8.0

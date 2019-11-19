#!/usr/bin/env bash
set -e && set +x && called=$_ && [[ ${called} != $0 ]]
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
CURRENT_FOLDER=`dirname ${SCRIPT_PATH}` && cd ${CURRENT_FOLDER} && cd .. && export REPO_DIR="$PWD" && set -x

source ${REPO_DIR}/scripts/cypress.sh
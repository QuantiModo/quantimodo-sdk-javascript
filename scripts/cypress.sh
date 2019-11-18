#!/usr/bin/env bash
set -e
called=$_ && [[ ${called} != $0 ]] && echo "${BASH_SOURCE[@]} is being sourced" || echo "${0} is being run"
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
SCRIPT_FOLDER=`dirname ${SCRIPT_PATH}` && cd ${SCRIPT_FOLDER} && cd .. && export REPO_DIR="$PWD"
export RELEASE_STAGE="${RELEASE_STAGE:-staging}"
cp cypress/config/cypress.${RELEASE_STAGE}.json cypress.json
set +x
npm install
echo "Saving host environment variables to host.env to access within docker"
printenv > ${REPO_DIR}/.env
echo "Creating /etc/asound.conf to deal with cannot find card '0' error message spam output"
sudo cp asound.conf /etc/asound.conf
gulp cypress
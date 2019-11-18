#!/usr/bin/env bash
set -e
called=$_ && [[ ${called} != $0 ]] && echo "${BASH_SOURCE[@]} is being sourced" || echo "${0} is being run"
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
SCRIPT_FOLDER=`dirname ${SCRIPT_PATH}` && cd ${SCRIPT_FOLDER} && cd .. && export REPO_DIR="$PWD"
export RELEASE_STAGE="${RELEASE_STAGE:-staging}"

cp cypress/config/cypress.${RELEASE_STAGE}.json cypress.json
set +x
if [[ -z ${DOCKERFILE_MODIFIED+x} ]]; then
    echo "DOCKERFILE_MODIFIED is unset so not doing docker-compose build";
else
    set -x
    docker-compose build
fi
set +x
if [[ -z ${PACKAGE_JSON_MODIFIED+x} ]]; then
    echo "PACKAGE_JSON_MODIFIED is unset so not doing npm install";
else
    set -x
    npm install
    #docker-compose up -d || true
    #docker-compose exec -T e2e bash -c "npm install"
fi
set -x
echo "Saving host environment variables to host.env to access within docker"
printenv > ${REPO_DIR}/.env
docker-compose up --abort-on-container-exit --exit-code-from e2e
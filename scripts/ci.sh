#!/usr/bin/env bash
set +x && called=$_ && [[ ${called} != $0 ]]
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
CURRENT_FOLDER=`dirname ${SCRIPT_PATH}` && cd ${CURRENT_FOLDER} && cd .. && export REPO_DIR="$PWD" && set -x
source scripts/output_commit_message_and_env.sh
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' nodejs|grep "install ok installed")
echo Checking for nodejs: ${PKG_OK}
if [[ "" == "$PKG_OK" ]]; then
    echo "nodejs not found so installing..."
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
set -e
npm install
npm run ci
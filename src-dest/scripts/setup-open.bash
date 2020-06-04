#!/bin/bash

SCRIPT_FOLDER=$(cd $(dirname "$0"); pwd)
cd $SCRIPT_FOLDER/.. # root

# Sets up service-mail

SERVICE_MAIL_FOLDER="service-mail"

pushd $SERVICE_MAIL_FOLDER
yarn install
popd 

echo ""
echo "Service-Mail Installed!"
echo ""

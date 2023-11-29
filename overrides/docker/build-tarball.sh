#!/bin/bash

SCRIPT_FOLDER=$(cd $(dirname "$0"); pwd)
cd $SCRIPT_FOLDER

cp -rf ../public_html/ ./public_html

tar czfv dockerized-open-pryv.io.tgz \
  ./local/dockerized-config.yml \
  ./local/dockerized-service-mail-config.hjson \
  ./local/docker-compose.yml \
  ./production-no-ssl \
  ./production-with-ssl \
  ./README.md \
  ./public_html \
  ./scripts/

rm -r ./public_html

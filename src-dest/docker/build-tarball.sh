#!/bin/bash

cp ../rec.la-certificates .
cp ../public_html .

tar czfv dockerized-open-pryv.io.tgz \
  ./local/dockerized-config.json \
  ./local/dockerized-service-mail-config.hjson \
  ./local/nginx-templates/ \
  ./local/dhparam.pem \
  ./local/docker-compose.with-ssl.yml \
  ./production-no-ssl \
  ./production-with-ssl \
  ./README.md
  ./rec.la-certificates \
  ./public_html \
  
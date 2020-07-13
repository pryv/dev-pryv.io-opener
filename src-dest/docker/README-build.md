# Build your own docker images

This guide explains how to build your own docker Open Pryv.io docker images.

*Prerequisites*:

- [Docker v19.03](https://docs.docker.com/engine/install/)
- [Docker-compose v1.26](https://docs.docker.com/compose/install/)

Prepare the various assets:

- Run `sh ../scripts/setup-app-web-auth3.bash`
- Run `sh ../scripts/setup-assets.bash`

## without SSL

Run `TAG=latest docker-compose -f local/docker-compose.no-ssl-build.yml up --build`

- [Config](https://github.com/pryv/open-pryv.io#config) file `local/docker-compose.no-ssl.yml`
- launch API on `http://localhost:3000`

After images are built, you can run the command above just without "--build" part.

## with SSL

Fetch the [rec-la](https://github.com/pryv/rec-la) SSL certificates:

- Run `sh ../scripts/download-recla-certificates.sh`

Run `TAG=latest docker-compose -f local/docker-compose.with-ssl-build.yml up --build`

- [Config](https://github.com/pryv/open-pryv.io#config) file `local/dockerized-config.json`
- Launch API on `https://my-computer.rec.la:4443`

After images are built, you can run the command above just without "--build" part.

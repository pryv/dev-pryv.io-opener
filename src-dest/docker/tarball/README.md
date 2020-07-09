# Dockerized Open Pryv.io

This archive contains the necessary files to download and run Open Pryv.io.

*Prerequisites*:

- [Docker v19.03](https://docs.docker.com/engine/install/)
- [Docker-compose v1.26](https://docs.docker.com/compose/install/)

## Local dev with SSL

Run:

```bash
docker-compose -f local/docker-compose.with-ssl-download.yml up
```

It will run the API on https://my-computer.rec.la:4443

If you want to serve the API on http://localhost:3000, use:

```bash
docker-compose -f local/docker-compose.no-ssl-download.yml up
```

Config file: `local/dockerized-config.json`

## Server with built-in SSL

1. Edit the following values in the config file `production-with-ssl/dockerized-config.json` and docker-compose file: `production-with-ssl/docker-compose.yml`:

   - ${HOSTNAME}
   - ${EMAIL}: 

2. Run:

```bash
docker-compose -f production-with-ssl/docker-compose.yml up
```

## Server with external SSL

1. Edit the following value in the config file `production-with-ssl/dockerized-config.json`:
   - ${HOSTNAME}

2. Run:

```bash
docker-compose -f production-no-ssl/docker-compose.yml up
```


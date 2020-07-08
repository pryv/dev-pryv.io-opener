# Dockerized Open Pryv.io

## Local dev with rec-la

1. run `sh run-rec-la`

## server with built-in SSL

1. Set your hostname in `dockerized-config.json`
2. run `sh run-with-ssl` or run `HOSTNAME=$HOSTNAME EMAIL=$EMAIL docker-compose -f docker-compose.yml up` setting the hostname for your Open Pryv.io platform and email for 

1. Edit the config dockerized-config.json and dockerized-service-mail-config.hjson config files with your setup (you can also find them in configs/production-with-ssl-docker/). See config section.
2. Run ./build_production.sh. This step will generate an SLL certificate for your hostname and run docker-compose to start the services.

## server with external SSL

2. run `sh run-with-ssl`
#### Build your own docker images without SSL

Run `./build-local.sh local/docker-compose.no-ssl-build.yml "up --build"`

- configuration file: `local/dockerized-config.json`

- download app-web-auth3 to app-web-auth3 directory
- download assets to public_html directory
- it will use the configuration file 
- build images and start `local/docker-compose.no-ssl.yml` docker-compose.
- launch API on `http://localhost:3000`

After images are built, you can run the command above just without "--build" part.

#### Build your own docker images with SSL

Run `./build-local.sh local/docker-compose.with-ssl-build.yml "up --build"`

- Edit the config file `local/dockerized-config.json`
- Start `local/docker-compose.with-ssl.yml` docker-compose.
- Launch API on `https://my-computer.rec.la`

After images are built, you can run the command above just without "--build" part. 

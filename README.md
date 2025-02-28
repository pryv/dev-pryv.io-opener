# Pryv.io Opener

Script that releases the open-pryv.io a strip down version of service-core, service-mail and service-register.
As of february 2025 All Pryv.io software has been open-sourced. 

## Usage

1. Fetch git dependencies: `just setup`
2. Fetch node dependencies: `just install`
3. Generate open-source release: `just build`
4. Verify the release in `./dest`

### Update git dependencies

For one or more of `service-core`, `service-register`, `service-mail`:

1. `cd {dependency}`
2. `git checkout master`
3. `git pull`
4. `cd ..`
5. git add, commit and push

## Publishing 

As per 1.9.0 integrated release has been removed. Github script `release-orig.yml` has been kept for reference.

Publish docker containers: 
- build the containers from `dest/docker`
- build the tarball with the confing with `build_tarball.sh`
- publish the containers `docker push "pryvio/open-pryv.io-api:{TAG}` & `docker push "pryvio/open-pryv.io-mail:{TAG}`
- Commit the content of `dest`
- Publish on github: push `dest` content 



## License

[BSD-3-Clause](LICENSE)

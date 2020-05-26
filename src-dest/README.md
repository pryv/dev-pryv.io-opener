# Pryv.io 

### install 

- `yarn setup`
- `yarn release`

### edit ./config.json

Pryv.io is designed to be exposed by a third party SSL temination such as `ngnix` 

- Change `singleCoreUrl` to match the hostname and port. It should be the "Public" URL to reach the service

### run 

- `yarn database &` 
- `yarn api`
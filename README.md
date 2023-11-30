# Pryv.io Opener

Script that releases the open source version of Pryv.io.


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

License settings and script are located in [`licenser/`](licenser/).


## Helpers for developpment

### Build
 In `dest/` run `just setup`, `just install`, `just build`

### Test
tests have to runned component by component
`cd dest/`
  - `just test {component}'`


## Design

### service-core

Changes made on **service-core** legacy code base to make it openable

#### Integration of register as a component (used if DNSLESS = true)

- Added `/reg` route in `routes/Path.js`
- Module is loaded directly from `server.js` with `expressApp` and `applications` parameters

### service-regiser

Changes made on **service-core** legacy code base to make it openable

This task had a very small impact on the code of register as the **node-app-opener** was able to strip out the necessary code.

Note the **striping comments** in `routes/admin.js` and `routes/user.js` that are used to remove parts of the code during build process of the open version.

Example:

The code between `// START - CLEAN ...` and `// END - CLEAN ...` will be removed

```javascript
// START - CLEAN FOR OPENSOURCE
const invitationToken = require('../storage/invitations');
// END - CLEAN FOR OPENSOURCE
```

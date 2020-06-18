# Pryv.io Opener

Script that releases the open source version of Pryv.io.

Folow dev on: [Trello Card](https://trello.com/c/6OyTu3Qi/861-pryv-opener)

## Usage

1. Fetch git dependencies: `yarn setup`
2. Fetch node dependencies: `yarn`
3. Generate open-source release: `yarn build` this step also licenses code with: `yarn license`
4. Verify the release in `./dest`

### Update git dependencies

1. `cd service-core`
2. `git checkout master`
3. `git pull`
4. `cd ..`
5. git add, commit and push

## License

License settings and script are located in [`licenser/`](licenser/).

## Helpers for developpment

1. In `dest/` run `yarn setup`, `yarn release`, `yarn watch`
2. `dest/dist/components/register` or other component you need to test
  - `pushd {your path}/app-node-opener/ ; yarn build ; popd ; ../../node_modules/.bin/mocha  'test/**/*.test.js'`
3. to start api-server cd to `dest` and use `cd ../ ; yarn build; cd dest; sleep 2 ; yarn api`  
  or: `cd ../ ; yarn build; cd dest; sleep 2 ; dist/components/api-server/bin/server --config ./config.json`

## Opener

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

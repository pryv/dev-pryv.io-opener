# Pryv Service-Core Opener

Script that extracts sources for the Open-Core version of Pryv.io

Folow dev on: [Trello Card](https://trello.com/c/6OyTu3Qi/861-pryv-opener)

# Install

1. checkout `app-node-opener` in the same directory
2. run `npm run setup` to checkout git dependencies such as `service-core` and `service-register` 

# Usage

1. run `npm run build`
2. check `src-dest/.api-version` 
3. check the **"Open-sourced version"** located in `./dest`
4. apply license notices with  `npm run license`

## License

License settings and exec can be found  in `./lincenser`


# Helpers for developpment 

1. in a terminal cd to `dest` run `yarn setup`, `yarn release`, `yarn watch`
2. in another terminal cd to `dest/dist/components/register` or other component you need to test
  - `pushd {your path}/app-node-opener/ ; npm run build ; popd ; ../../node_modules/.bin/mocha  'test/**/*.test.js'`

3. to start api-server cd to `dest` and use `cd ../ ; npm run build; cd dest; sleep 2 ; yarn api`  
  or: `cd ../ ; npm run build; cd dest; sleep 2 ; dist/components/api-server/bin/server --config ./config.json`

# Opener 

## change Log and comments for Review 

### service-core

Changes made on **service-core** legacy code base to make it openable

####  integration of register as a component (used if DNSLESS = true)

- Added `/reg` route in `routes/Path.js`
- Module is loaded directly from `server.js` with `expressApp` and `applications` parameters

#### service-info supports singleCoreUrl config parameter

- If set this parameters 
  - is used for the `service` settings  `api`, `reg` and `access`
  - Flag that indicates that `service.info` should be loaded from the configuration (not online).
  - The serial is generated with the timestamp of the start of ther server

Note: this parameter could be used instead of `.env` to derminate the environment 

#### Comments:

- They are redundencies in the `.env` and `singleCoreUrl` config settings. In an optimal situation one single way of set-up should used. 

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

### app-node-opener

Build tool that creates a testable, ready to be shipped distribution of Pryv.io as a singleCore 

##### Build flow

1. rsync subset of `service-core` and `service-register` that are checkedout as git submdoules in `app-node-opener`. 
2. using sed, some lines are `removed` or `replaced`in cherry-picked files
3. the content of `src-dest` is synched to `dest`. These files represents the code base unique to the open version of pryv.

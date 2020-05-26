# Pryv Service-Core Opener

Script that extracts sources for the Open-Core version of Pryv.io

# Usage

1. checkout `service-core`, `service-register` and `app-node-opener` in the same directory
2. eventually update `src-dest/.api-version` and set the version of the future open-source release
3. run `npm run build`

The **"Open-sourced version"** will be located in `./dest`


# Helpers for developpment 

1. in a terminal cd to `dest` run `yarn setup`, `yarn release`, `yarn watch`
2. in another terminal cd to `dest/dist/components/register` or other component you need to test
  - `pushd {your path}/app-node-opener/ ; npm run build ; popd ; ../../node_modules/.bin/mocha  'test/**/*.test.js'`

3. to start api-server cd to `dest` and use `cd ../ ; npm run build; cd dest; sleep 2 ; yarn api`



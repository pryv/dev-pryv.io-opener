# Pryv.io Opener

Script that releases the open source version of Pryv.io.


## Usage

1. Fetch git dependencies: `yarn setup`
2. Fetch node dependencies: `yarn`
3. Generate open-source release: `yarn build` this step also licenses code with: `yarn license`
4. Verify the release in `./dest`

### Update git dependencies

For one or more of `service-core`, `service-register`, `service-mail`:

1. `cd {dependency}`
2. `git checkout master`
3. `git pull`
4. `cd ..`
5. git add, commit and push


## License

License settings and script are located in [`licenser/`](licenser/).


## Helpers for developpment

### Build
 In `dest/` run `just setup-dev-env`, `just install`, `just compile-dev`

### Test
tests have to runned component by component 
`cd dest/` 
  - `just test {component}'`

combined with `just compile-watch` in `dest` and `yarn build` each time you do modifcation you can code in a source repository and test your changes

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

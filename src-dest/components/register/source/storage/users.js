// @flow

/**
 * Extension of database.js dedicated to user management
 */

const db = require('../storage/database');
const async = require('async');
const lodash = require('lodash');
const logger = require('winston');
const messages = require('../utils/messages');
const domain = '.' + require('../config').get('dns:domain');

type GenericCallback<T> = (err?: ?Error, res: ?T) => mixed;
type Callback = GenericCallback<mixed>;

export type UserInformation = {
  id?: string,

  username: string,
  email: string,
  language: string,

  password: string,
  passwordHash: string,

  invitationToken: string,
  registeredTimestamp?: number,

  server?: string,
}

type CreateResult = {
  username: string,
  server: string,
};

/**
 * Create (register) a new user
 * 
 * @param host the hosting for this user
 * @param user the user data, a json object containing: username, password hash, language and email
 * @param callback function(error,result), result being a json object containing new user data
 */
exports.create = function create(host, inUser: UserInformation, callback: GenericCallback<CreateResult>) {
  const user = lodash.clone(inUser);

  // We store usernames and emails as lower case, allowing comparison with any
  // other lowercase string.
  user.username = user.username.toLowerCase();
  user.email = user.email.toLowerCase();

  // Construct the request for core, including the password. 
  const request = {
    username: user.username,
    passwordHash: user.passwordHash,
    language: user.language,
    email: user.email
  };

  // Remove to forget the password
  delete user.passwordHash;
  delete user.password;

  db.createUser(request, function (error, result) {
    if (error) return callback(error, null);
    if (! result || !result.id) return callback(new Error('Invalid answer from core'), null);
    callback(error, {
      username: user.username,
      server: user.username + domain
    });
  });
};

type ServerUsageStats = {
  [name: string]: number
};

/**
 * Get a list of users on a specific server
 * @param serverName: the name of the server
 * @param callback: function(error, result), result being an array of users
 */
exports.getUsersOnServer = function (serverName: string, callback: Callback) {
  var result = [];
  db.doOnKeysValuesMatching('*:server', serverName,
    function (key) {
      result.push(key.split(':')[0]);
    },
    function (error) {
      callback(error, result);
    });
};

/**
 * Get a list of all user's information (see getUserInfos)
 * @param callback: function(error, result), result being a list of information for all users
 */
exports.getAllUsersInfos = function (callback: GenericCallback<Array<UserInformation>>) {
  const userlist = [];
  let waiter = 1;

  function done() {
    waiter--;
    if (waiter === 0) {
      callback(null, userlist);
    }
  }

  db.doOnKeysMatching('*:users',
    function (userkey) { // action
      const user = userkey.substring(0, userkey.length - 6);
      waiter++;

      this.getUserInfos(user, function (errors, userInfos) {
        if (errors != null && errors.length > 0) {
          userInfos.errors = errors;
        }
        userlist.push(userInfos);
        done();
      });
    }.bind(this), function (/*error, count*/) {  // done
      done();
    });
};

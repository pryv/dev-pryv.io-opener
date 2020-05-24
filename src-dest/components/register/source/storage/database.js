// @flow

const async = require('async');
const semver = require('semver');
const logger = require('winston');
const lodash = require('lodash');

const messages = require('../utils/messages');

type GenericCallback<T> = (err?: ?Error, res: ?T) => mixed;
type Callback = GenericCallback<mixed>;

import type { UserInformation } from './users';

export type AccessState = {
  status: 'NEED_SIGNIN' | 'REFUSED' | 'ERROR' | 'ACCEPTED',
  // HTTP Status Code to send when polling.
  code: number,
  // Poll Key
  key?: string,
  requestingAppId?: string,
  requestedPermissions?: PermissionSet,
  url?: string,
  poll?: string,
  returnURL?: ?string,
  oauthState?: OAuthState,
  poll_rate_ms?: number,
}
type OAuthState = string | null;
import type { PermissionSet } from '../utils/check-and-constraints';

const fakeRedis = {};

const references = {};

/**
 * Load external references
 */
function setReference(key, value) {
  references[key] = value;
}
exports.setReference = setReference;

function users() {
  return references.storage.users;
}

/**
 * Check if an email address exists in the database
 * @param email: the email address to verify
 * @param callback: function(error,result), result being 'true' if it exists, 'false' otherwise
 */
function emailExists(email: string, callback: GenericCallback<boolean>) {
  email = email.toLowerCase();
  getUIDFromMail(email, function (error, username) {
    if (error != null)
      logger.error('Redis emailExists: ' + email + ' e: ' + error, error);

    callback(error, username !== null);
  });
}
exports.emailExists = emailExists;

/**
 * Check if an user id exists in the database
 * @param uid: the user id to verify
 * @param callback: function(error,result), result being 'true' if it exists, 'false' otherwise
 */
exports.uidExists = function (uid: string, callback: Callback) {
  uid = uid.toLowerCase();
  redis.exists(uid + ':users', function (error, result) {
    if (error) {
      logger.error('Redis to uidExists: ' + uid + ' e: ' + error, error);
    }
    callback(error, result === 1); // callback anyway
  });
};

/**
 * Get the server linked with provided user id
 * @param uid: the user id
 * @param callback: function(error,result), result being the server name
 */
exports.getServer = function (uid: string, callback: GenericCallback<string>) {
  return callback(null, 'SERVER_NAME');
};


/**
 * Get user id linked with provided email address
 * @param mail: the email address
 * @param callback: function(error,result), result being the requested user id
 */
function getUIDFromMail (mail: string, callback: GenericCallback<string>) {
  mail = mail.toLowerCase();
  users().findOne({email: mail}, null, function (error, res) {
    if (error) {
      logger.error('Mongo getServerFromMail: ' + mail + ' e: ' + error, error);
    }
    if (! res) { return callback(null, null); }
    return callback(null, res.username);
  });
};
exports.getUIDFromMail = getUIDFromMail;


/**
 * Update the state of an access in the database
 * @param key: the database key for this access
 * @param value: the new state of this access
 * @param callback: function(error,result), result being the result of the database transaction
 */
exports.setAccessState = function (
  key: string, value: AccessState,
  callback: Callback,
) {
  const multi = redis.multi();
  const dbkey = key + ':access';
  multi.set(dbkey, JSON.stringify(value));
  multi.expire(dbkey, config.get('persistence:access-ttl'));
  multi.exec(function (error, result) {
    if (error) {
      logger.error('Redis setAccess: ', key, value, error);
    }
    callback(error, result); // callback anyway
  });
};

/** Get the current state of an access in the database.
 *
 * @param key {string} - the database key for this access
 * @param callback {nodejsCallback} - result being the corresponding JSON 
 *    database entry
 */
exports.getAccessState = function (key: string, callback: GenericCallback<AccessState>) {
  // FLOW Since we access the right key, we assume that the data is correct.
  const mixedCallback: Callback = callback;

  getJSON(key + ':access', mixedCallback);
};

//----------------- Reserved words --------------//

var RESERVED_WORDS_VERSION = 'reservedwords:version';
var RESERVED_WORDS_LIST = 'reservedwords:list';

/**
 * Get the current version of the reserved words list in the database
 * @param callback: function(error,result), result being the version
 */
exports.reservedWordsVersion = function (callback: Callback) {
  redis.get(RESERVED_WORDS_VERSION, function (error, version) {
    if (error) {
      logger.error('ReservedWordManagement version ' + error, error);
      return callback(error);
    }
    return callback(null, version);
  });
};

/**
 * Load an up-to-date version of the reserved words list in the database
 * @param version: the new version
 * @param wordArray: the new words list
 * @param callback: function(error)
 */
exports.reservedWordsLoad = function (
  version: string, wordArray: Array<string>,
  callback: Callback
) {
  callback();
};

/**
 * Check if the reserved words list contains provided word
 * @param word: the word to check for existence
 * @param callback: function(error,result), result being 'true' if existing, 'false' otherwise
 */
exports.reservedWordExists = function (word: string, callback: GenericCallback<boolean>) {
  callback(null, false);
};

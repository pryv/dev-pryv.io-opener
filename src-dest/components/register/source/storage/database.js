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
  users().findOne({ username: uid }, null, function (error, res) {
    if (!res) { return callback(null, null); }
    return callback(error, res !== null);
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


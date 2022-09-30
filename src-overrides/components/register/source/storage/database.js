// @flow

const async = require('async');
const semver = require('semver');
const logger = require('winston');
const lodash = require('lodash');

const messages = require('../utils/messages');

type GenericCallback<T> = (err?: ?Error, res: ?T) => mixed;
type Callback = GenericCallback<mixed>;

const SystemStreamsSerializer = require('business/src/system-streams/serializer');

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

function getRawEventCollection(callback) {
  references.storage.connection.getCollectionSafe({name: 'events'}, 
  function errorCallback(err) { callback(err, null); },
  function sucessCallback(col) { callback(null, col); })
}

function systemCall(...args) {
  return references.systemAPI.call(...args);
}


function createUser(request, callback) {
  systemCall('system.createUser', {}, request, callback);
}
exports.createUser = createUser;

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
  const context = {};
  async.series([
    function (done) { 
      getRawEventCollection(function(err, eventCollection) {  
        context.eventCollection = eventCollection;
        done(err);
      });
    },
    function (done) { 
      if (! context.userId) return done();
      context.eventCollection.findOne({content: uid, streamIds: {$in : [SystemStreamsSerializer.addCorrectPrefixToAccountStreamId('username')]}, type: 'identifier/string'}, function(err, res) {
        context.username = res?.content;
        done(err);
      }); 
    }
  ], function(err) { 
    callback(err, context.username !== null);
  })
 
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
function getUIDFromMail(mail: string, callback: GenericCallback<string>) {
  mail = mail.toLowerCase();
  const context = {};
  async.series([
    function (done) { 
      getRawEventCollection(function(err, eventCollection) {  
        context.eventCollection = eventCollection;
        done(err);
      });
    },
    function (done) { 
      context.eventCollection.findOne({content: mail, streamIds: {$in : [SystemStreamsSerializer.addCorrectPrefixToAccountStreamId('email')]}, type: 'email/string'}, function(err, res) {
        context.userId = res?.userId;
        done(err);
      }); 
    },
    function (done) { 
      if (! context.userId) return done();
      context.eventCollection.findOne({userId: context.userId, streamIds: {$in : [SystemStreamsSerializer.addCorrectPrefixToAccountStreamId('username')]}, type: 'identifier/string'}, function(err, res) {
        context.username = res?.content;
        done(err);
      }); 
    }
  ], function(err) { 
    callback(err, context.username);
  })
 
};
exports.getUIDFromMail = getUIDFromMail;

/**
 * Get all users
 */
function getAllUsers(callback: GenericCallback<string>) {
  const context = {};
  async.series([
    function (done) {
      getRawEventCollection(function(err, eventCollection) {
        context.eventCollection = eventCollection;
        done(err);
      });
    },
    function (done) {
      const cursor = context.eventCollection.aggregate(query_get_all(), { cursor: { batchSize: 1 }}); 
  
      context.users = [];
      cursor.each(function(err, item) {
        if (err) return done(err);
        if (item === null) return done();
        const user = {
          id: item._id?.userId,
          registeredTimestamp: item.smallestCreatedAt * 1000
        }
        if (item.events) {
          for (let event of item.events) {
            if (event.type === 'email/string' && event.streamIds.includes(SystemStreamsSerializer.addCorrectPrefixToAccountStreamId('email'))) {
              user.email = event.content;
            } else if (event.type === 'language/iso-639-1' && event.streamIds.includes(SystemStreamsSerializer.addCorrectPrefixToAccountStreamId('language'))) {
              user.language = event.content;
            } else if (event.type === 'identifier/string' && event.streamIds.includes(SystemStreamsSerializer.addCorrectPrefixToAccountStreamId('username'))) {
              user.username = event.content;
            } else if (event.type === 'identifier/string' && event.streamIds.includes(SystemStreamsSerializer.addCorrectPrefixToAccountStreamId('referer'))) {
              user.referer = event.content;
            } else {
              console.log('Unkown field... ', event);
            }
          }
        }
        context.users.push(user);
      });
    }
  ], function(err) { 
    callback(err, context.users);
  });

};
exports.getAllUsers = getAllUsers;

const dbAccessState = {};
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
  dbAccessState[key] = { value: value, time: Date.now() };
  callback(null, value); // callback anyway
};

/** Get the current state of an access in the database.
 *
 * @param key {string} - the database key for this access
 * @param callback {nodejsCallback} - result being the corresponding JSON 
 *    database entry
 */
exports.getAccessState = function (key: string, callback: GenericCallback<AccessState>) {
  const res = dbAccessState[key];
  callback(null, res ? res.value : null);
};

/**
 * Timer to autoclean dbAccessState
 */
function cleanAccessState() {
  const expired = Date.now() - (60 * 10 * 1000); // 10 minutes
  try {
    Object.keys(dbAccessState).forEach((key) => {
      if (dbAccessState[key].time < expired) delete dbAccessState[key];
    });
  } catch (e) {
    console.log(e);
  }
  setTimeout(cleanAccessState, 60 * 1000); // check every minutes
}

cleanAccessState(); // launch cleaner

let QUERY_GET_ALL = null;
function query_get_all() {
  if (QUERY_GET_ALL !== null) return QUERY_GET_ALL;
  QUERY_GET_ALL = [
    {
      '$match': {
        streamIds: { '$in': [ 'email', 'language', 'referer' ].map(SystemStreamsSerializer.addCorrectPrefixToAccountStreamId) }
      }
    },
    {
      '$group': {
        _id: { userId: '$userId' },
        smallestCreatedAt: { '$min': '$created' },
        events: {
          '$push': { content: '$content', streamIds: '$streamIds', type: '$type' }
        }
      }
    },
    {'$sort': { smallestCreatedAt: 1 }}
  ];
  return QUERY_GET_ALL;
}
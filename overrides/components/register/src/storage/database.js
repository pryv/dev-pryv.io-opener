const { getUsersRepository } = require('business/src/users/repository');
const { getPlatform } = require('platform');
let platform = null;
let usersRepository = null;

exports.init = async function init() {
  platform = await getPlatform();
  usersRepository = await getUsersRepository();
}

/** @returns {any} */
function systemCall(...args) {
  return references.systemAPI.call(...args);
}
/** @returns {void} */
function createUser(request, callback) {
  systemCall('system.createUser', {}, request, callback);
}
exports.createUser = createUser;
/**
 * Check if an email address exists in the database
 * @param {string} email  : the email address to verify
 * @param {GenericCallback<boolean>} callback  : function(error,result), result being 'true' if it exists, 'false' otherwise
 * @returns {void}
 */
function emailExists(email, callback) {
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
exports.uidExists = async function (uid, callback) {
  try {
    const username = uid.toLowerCase();
    const exists = usersRepository.usernameExists(username);
    return callback(null, exists);
  } catch (err) {
    return callback(err);
  }
};
/**
 * Get the server linked with provided user id
 * @param uid: the user id
 * @param callback: function(error,result), result being the server name
 */
exports.getServer = function (uid, callback) {
  return callback(null, 'SERVER_NAME');
};
/**
 * Get user id linked with provided email address
 * @param {string} mail  : the email address
 * @param {GenericCallback<string>} callback  : function(error,result), result being the requested user id
 * @returns {void}
 */
async function getUIDFromMail(mail, callback) {
  try {
    const cleanmail = mail.toLowerCase();
    const username = await platform.getLocalUsersUniqueField('email', mail);
    return callback(null, username);
  } catch (err) {
    return callback(err, null);
  }
}
exports.getUIDFromMail = getUIDFromMail;
/**
 * Get all users
 * @returns {Users[]}
 */
async function getAllUsers() {
  // we are missing here 'server' and 'referer'
  const usersNamesAndIds = await usersRepository.getAllUsersNamesAndId();
  const result = [];
  for(const userNameAndId of usersNamesAndIds) {
    const user = await usersRepository.getUserBuiltOnSystemStreamsById(userNameAndId.id);
    if (user == null) {
      console.log('XXXXX Null user', userNameAndId);
    } else {
      const userAccountInfos = user.getFullAccount();
      let registeredTimestamp = Number.MAX_SAFE_INTEGER;
      // deduct creation data from smallest ceatedAt date in event
      for (const event of user.events) {
        if (event.created < registeredTimestamp) registeredTimestamp = event.created;
      }
      const userInfos = Object.assign({ id: userNameAndId.id, username: userNameAndId.username , registeredTimestamp }, userAccountInfos);
      result.push(userInfos);
    }
  }
  return result;
}
exports.getAllUsers = getAllUsers;
const dbAccessState = {};
/**
 * Update the state of an access in the database
 * @param key: the database key for this access
 * @param value: the new state of this access
 * @param callback: function(error,result), result being the result of the database transaction
 */
exports.setAccessState = function (key, value, callback) {
  dbAccessState[key] = { value: value, time: Date.now() };
  callback(null, value); // callback anyway
};
/** Get the current state of an access in the database.
 *
 * @param key {string} - the database key for this access
 * @param callback {nodejsCallback} - result being the corresponding JSON
 *    database entry
 */
exports.getAccessState = function (key, callback) {
  const res = dbAccessState[key];
  callback(null, res ? res.value : null);
};
/**
 * Timer to autoclean dbAccessState
 * @returns {void}
 */
function cleanAccessState() {
  const expired = Date.now() - 60 * 10 * 1000; // 10 minutes
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
/** @returns {any} */

/** @typedef {(err?: Error | null, res?: T | null) => unknown} GenericCallback */
/** @typedef {GenericCallback<unknown>} Callback */
/**
 * @typedef {{
 *   status: "NEED_SIGNIN" | "REFUSED" | "ERROR" | "ACCEPTED"
 *   // HTTP Status Code to send when polling.
 *   code: number
 *   // Poll Key
 *   key?: string
 *   requestingAppId?: string
 *   requestedPermissions?: PermissionSet
 *   url?: string
 *   poll?: string
 *   returnURL?: string | null
 *   oauthState?: OAuthState
 *   poll_rate_ms?: number
 * }} AccessState
 */
/** @typedef {string | null} OAuthState */

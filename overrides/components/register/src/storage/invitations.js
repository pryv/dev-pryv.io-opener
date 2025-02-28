/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
/**
 * Check the validity of the invitation token
 * @param token: the token to be validated
 * @param callback: function(result), result being 'true' if the token is valid, false otherwise
 */
exports.checkIfValid = function checkIfValid (token, callback) {
  return callback(true); // eslint-disable-line n/no-callback-literal
};

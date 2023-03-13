/**
 * @license
 * Copyright (C) 2012-2021 Pryv S.A. https://pryv.com - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
function setAuditAccessId(accessId) {
  return function (context, params, result, next) {
    next();
  };
}

const AuditAccessIds = {
  VALID_PASSWORD: 'valid-password',
  PASSWORD_RESET_REQUEST: 'password-reset-request',
  PASSWORD_RESET_TOKEN: 'password-reset-token',
  ADMIN_TOKEN: 'admin',
  PUBLIC: 'public',
  INVALID: 'invalid'
};

Object.freeze(AuditAccessIds);

module.exports = {
  setAuditAccessId: setAuditAccessId,
  AuditAccessIds: AuditAccessIds
};

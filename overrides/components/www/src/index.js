/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const path = require('path');
const express = require('express');

const headPath = require('api-server/src/routes/Paths').WWW;
const publicHtml = path.resolve(__dirname, '../../../public_html');

module.exports = async (expressApp, application) => {
  expressApp.use(headPath, express.static(publicHtml));
  // register all www routes
  expressApp.all(headPath + '/*', function (req, res, next) {
    res
      .status(404)
      .send({ id: 'unkown-route', message: 'Unknown route: ' + req.path });
  });
};

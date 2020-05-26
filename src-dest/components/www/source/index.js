const path = require('path');
const express = require('express');

const headPath = require('components/api-server/src/routes/Paths').WWW;
const publicHtml = path.resolve(__dirname, '../../../../public_html');


module.exports = async (expressApp, application) => {
  expressApp.use(headPath, express.static(publicHtml));
}
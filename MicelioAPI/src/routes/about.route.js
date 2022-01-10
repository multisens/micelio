const express = require('express');
const path = require("path");
const Router = express.Router();

Router.get('/', async (request, response) => {
  const baseDir = path.join(__dirname, '..', '..')
  return response.status(200).sendFile('README.md', {root: baseDir});
});

module.exports = Router;

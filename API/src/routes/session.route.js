const express = require('express');
const SessionController = require('../controllers/SessionController.js');

const Router = express.Router();
const sessionController = new SessionController;

Router.post('/', sessionController.create);
Router.put('/', sessionController.update);

module.exports = Router;

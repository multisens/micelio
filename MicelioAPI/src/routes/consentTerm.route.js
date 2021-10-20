const express = require('express');
const ConsentTermController = require('../controllers/ConsentTermController');

const Router = express.Router();

const consentTermController = new ConsentTermController();

Router.get('/:experiment_id', consentTermController.get)
Router.post('/:experiment_id', consentTermController.update);

module.exports = Router;

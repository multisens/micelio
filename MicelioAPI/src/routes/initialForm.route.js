const express = require('express');
const InitialFormController = require('../controllers/InitialFormController');

const Router = express.Router();

const initialFormController = new InitialFormController();

Router.get('/:experiment_id', initialFormController.get)
Router.post('/:experiment_id', initialFormController.update);

module.exports = Router;

const express = require('express');
const InitialQuestController = require('../controllers/InitialQuestController');

const Router = express.Router();

const initialQuestController = new InitialQuestController();

Router.get('/:experiment_id', initialQuestController.get)
Router.post('/:experiment_id', initialQuestController.update);

module.exports = Router;

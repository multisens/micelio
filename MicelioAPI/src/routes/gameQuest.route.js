const express = require('express');
const GameQuestController = require('../controllers/GameQuestController');

const Router = express.Router();

const gameQuestController = new GameQuestController();

Router.get('/:experiment_id', gameQuestController.get)
Router.post('/:experiment_id', gameQuestController.update);

module.exports = Router;

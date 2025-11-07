const express = require('express');
const GameFormController = require('../controllers/GameFormController');

const Router = express.Router();

const gameFormController = new GameFormController();

Router.get('/:experiment_id/:participant_id', gameFormController.get)
Router.post('/:experiment_id', gameFormController.update);

module.exports = Router;

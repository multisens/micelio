const express = require('express');
const GameController = require('../controllers/GameController.js');

const Router = express.Router();
const gameController = new GameController();

Router.get('/:game_id', gameController.index)
Router.get('/', gameController.get)
Router.post('/', gameController.create);

module.exports = Router;

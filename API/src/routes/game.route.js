const express = require('express');
const GameController = require('../controllers/GameController.js');

const Router = express.Router();
const gameController = new GameController;


Router.post('/', gameController.create);

module.exports = Router;

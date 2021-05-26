

const express = require('express');
const GameController = require('../controllers/GameController.js');
const ShareController = require ("../controllers/ShareController");

const Router = express.Router();

const gameController = new GameController();
const shareController = new ShareController();


Router.get('/:game_id', gameController.index);
Router.get('/', gameController.get);
Router.post('/', gameController.create);

Router.post('/share', shareController.create)

module.exports = Router;

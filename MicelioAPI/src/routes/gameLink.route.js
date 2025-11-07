const express = require('express');
const GameLinkController = require('../controllers/GameLinkController');

const Router = express.Router();

const gameLinkController = new GameLinkController();

Router.get('/:experiment_id', gameLinkController.get)
Router.post('/:experiment_id', gameLinkController.update);

module.exports = Router;

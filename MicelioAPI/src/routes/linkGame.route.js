const express = require('express');
const LinkGameController = require('../controllers/LinkGameController');

const Router = express.Router();

const linkGameController = new LinkGameController();

Router.get('/:experiment_id', linkGameController.get)
Router.post('/:experiment_id', linkGameController.update);

module.exports = Router;

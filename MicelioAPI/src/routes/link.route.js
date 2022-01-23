const express = require('express');
const LinkController = require('../controllers/LinkController');

const Router = express.Router();

const linkController = new LinkController();

Router.get('/:experiment_id', linkController.get)
Router.post('/:experiment_id', linkController.update);

module.exports = Router;

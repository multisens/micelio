const express = require('express');
const SpecQuestController = require('../controllers/SpecQuestController');

const Router = express.Router();

const specQuestController = new SpecQuestController();

Router.get('/:experiment_id', specQuestController.get)
Router.post('/:experiment_id', specQuestController.update);

module.exports = Router;

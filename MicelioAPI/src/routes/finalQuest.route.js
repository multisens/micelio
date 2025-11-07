const express = require('express');
const FinalQuestController = require('../controllers/FinalQuestController');

const Router = express.Router();

const finalQuestController = new FinalQuestController();

Router.get('/:experiment_id', finalQuestController.get)
Router.post('/:experiment_id', finalQuestController.update);

module.exports = Router;

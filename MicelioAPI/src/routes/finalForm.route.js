const express = require('express');
const FinalFormController = require('../controllers/FinalFormController');

const Router = express.Router();

const finalFormController = new FinalFormController();

Router.get('/:experiment_id/:participant_id', finalFormController.get)
Router.post('/:experiment_id', finalFormController.update);

module.exports = Router;

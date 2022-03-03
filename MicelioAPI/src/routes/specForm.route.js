const express = require('express');
const SpecFormController = require('../controllers/SpecFormController');

const Router = express.Router();

const specFormController = new SpecFormController();

Router.get('/:experiment_id/:participant_id', specFormController.get)
Router.post('/:experiment_id', specFormController.update);

module.exports = Router;

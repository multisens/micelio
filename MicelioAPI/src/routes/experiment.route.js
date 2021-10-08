const express = require('express');
const ExperimentController = require('../controllers/ExperimentController');

const Router = express.Router();

const experimentController = new ExperimentController();

Router.get('/', experimentController.get)
Router.post('/', experimentController.create);

module.exports = Router;

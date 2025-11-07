const express = require('express');
const FormController = require('../controllers/FormController.js');

const Router = express.Router();

const formController = new FormController();

Router.get('/:experiment_id', formController.get)
Router.post('/:experiment_id', formController.create);

module.exports = Router;

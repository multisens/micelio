const express = require('express');
const FormController = require('../controllers/FormController.js');

const Router = express.Router();

const formController = new FormController();

Router.get('/:experiment_id', formController.get)
Router.post('/', formController.create);

module.exports = Router;

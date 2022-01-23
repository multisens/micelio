const express = require('express');
const QuizController = require('../controllers/QuizController');

const Router = express.Router();

const quizController = new QuizController();

Router.get('/:experiment_id', quizController.get)
Router.post('/:experiment_id', quizController.update);

module.exports = Router;

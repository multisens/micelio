const express = require('express');
const UserController = require('../controllers/UserController.js');

const Router = express.Router();
const userController = new UserController();

Router.post('/', userController.create);

module.exports = Router;

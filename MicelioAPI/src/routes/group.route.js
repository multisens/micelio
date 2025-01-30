const express = require('express');
const Router = express.Router();

const GroupController = require('../controllers/GroupController');

const groupController = new GroupController();


Router.get('/', groupController.get);
Router.get('/ids/:game_id', groupController.getIds);

Router.post('/', groupController.create);

module.exports = Router;

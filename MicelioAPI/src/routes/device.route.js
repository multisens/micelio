const express = require('express');
const DeviceController = require('../controllers/DeviceController.js');

const Router = express.Router();
const deviceController = new DeviceController;

Router.post('/', deviceController.create);
Router.post('/test', deviceController.create);

//testar validação
Router.get('/validate',deviceController.validate);

module.exports = Router;
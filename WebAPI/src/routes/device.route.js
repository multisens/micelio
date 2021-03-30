const express = require('express');
const DeviceController = require('../controllers/DeviceController.js');

const Router = express.Router();
const deviceController = new DeviceController;


Router.post('/', deviceController.create); 

module.exports = Router;
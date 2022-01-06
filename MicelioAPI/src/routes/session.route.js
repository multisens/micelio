const express = require('express');
const SessionController = require('../controllers/SessionController.js');

const DeviceIDMiddleware = require('../middleware/DeviceIDMiddleware');

const Router = express.Router();
const sessionController = new SessionController;

Router.post('/', DeviceIDMiddleware, sessionController.create);
Router.post('/test', DeviceIDMiddleware, sessionController.create);

Router.put('/', DeviceIDMiddleware, sessionController.update);
Router.put('/test', DeviceIDMiddleware, sessionController.update);

module.exports = Router;

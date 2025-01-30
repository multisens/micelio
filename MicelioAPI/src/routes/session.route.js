const express = require('express');
const SessionController = require('../controllers/SessionController.js');
const TokenMiddleware = require("../middleware/TokenMiddleware")
const DeviceIDMiddleware = require('../middleware/DeviceIDMiddleware');

const Router = express.Router();
const sessionController = new SessionController;

Router.get("/:game_id", sessionController.index);

Router.post('/', TokenMiddleware, DeviceIDMiddleware, sessionController.create);
Router.post('/test', TokenMiddleware, DeviceIDMiddleware, sessionController.create);

Router.put('/', TokenMiddleware, DeviceIDMiddleware, sessionController.update);
Router.put('/test', TokenMiddleware, DeviceIDMiddleware, sessionController.update);

module.exports = Router;

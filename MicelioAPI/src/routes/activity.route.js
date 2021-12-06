const express = require('express');
const ActivityController = require('../controllers/ActivityController');

const DeviceIDMiddleware = require('../middleware/DeviceIDMiddleware');

const Router = express.Router();
const activityController = new ActivityController();

Router.post('/', DeviceIDMiddleware, activityController.create);
Router.post('/test', DeviceIDMiddleware, activityController.create);

Router.get('/', activityController.index);

module.exports = Router;

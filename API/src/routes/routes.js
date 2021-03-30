const express    = require('express');

const GameRoutes = require('./game.route');
const DeviceRoutes = require('./device.route');
const SessionRoutes = require('./session.route');
const ActivityRoutes = require('./activity.route');

const TokenMiddleware = require('../middleware/TokenMiddleware');
const DeviceIDMiddleware = require('../middleware/DeviceIDMiddleware');

const Router = express.Router();

function log(request, response, next) {

    console.log(request.headers);
    console.log(request.body);

    next();

}

Router.use('/game', log, GameRoutes);
Router.use('/device', TokenMiddleware, DeviceRoutes);
Router.use('/session', TokenMiddleware, DeviceIDMiddleware, SessionRoutes);
Router.use('/activity', TokenMiddleware, DeviceIDMiddleware, ActivityRoutes);

module.exports = Router;

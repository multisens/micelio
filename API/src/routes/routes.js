const express    = require('express');

const GameRoutes = require('./game.route');
const DeviceRoutes = require('./device.route');
const SessionRoutes = require('./session.route');
const ActivityRoutes = require('./activity.route');

const TokenMiddleware = require('../middleware/TokenMiddleware');

const Router = express.Router();

Router.use('/game', GameRoutes);
Router.use('/device', TokenMiddleware, DeviceRoutes);
Router.use('/session', TokenMiddleware, SessionRoutes);
Router.use('/activity', TokenMiddleware, ActivityRoutes);

module.exports = Router;

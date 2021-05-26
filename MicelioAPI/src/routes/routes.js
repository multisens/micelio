const express    = require('express');

const GameRoutes = require('./game.route');
const DeviceRoutes = require('./device.route');
const SessionRoutes = require('./session.route');
const ActivityRoutes = require('./activity.route');
const UserRoutes = require('./user.route');
const GroupRoutes = require('./group.route');

const TokenMiddleware = require('../middleware/TokenMiddleware');
const DeviceIDMiddleware = require('../middleware/DeviceIDMiddleware');
const LogMiddleware = require('../middleware/LogMiddleware');

const Router = express.Router();

Router.use('/user', LogMiddleware, UserRoutes);
Router.use('/game', LogMiddleware, GameRoutes);
Router.use('/device', LogMiddleware, TokenMiddleware, DeviceRoutes);
Router.use('/session', LogMiddleware, TokenMiddleware, DeviceIDMiddleware, SessionRoutes);
Router.use('/activity', LogMiddleware, TokenMiddleware, DeviceIDMiddleware, ActivityRoutes);
Router.use('/group', LogMiddleware, GroupRoutes);

module.exports = Router;

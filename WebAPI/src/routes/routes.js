const express    = require('express');

const GameRoutes = require('./game.route');
const DeviceRoutes = require('./device.route');
const SessionRoutes = require('./session.route');
const ActivityRoutes = require('./activity.route');

const TokenMiddleware = require('../middleware/TokenMiddleware');
const DeviceIDMiddleware = require('../middleware/DeviceIDMiddleware');

const Router = express.Router();

function APIlog(request, response, next) {

    const marker = ' :: ';
    const data = request.method + marker + request.originalUrl + marker + request.headers['host'] + marker + request.headers['user-agent'] + marker +  request.headers.token

    console.log(data);

    next();

}

Router.use('/game', APIlog, GameRoutes);
Router.use('/device', APIlog, TokenMiddleware, DeviceRoutes);
Router.use('/session', APIlog, TokenMiddleware, DeviceIDMiddleware, SessionRoutes);
Router.use('/activity', APIlog, TokenMiddleware, DeviceIDMiddleware, ActivityRoutes);

module.exports = Router;

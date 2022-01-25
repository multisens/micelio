const express    = require('express');

const GameRoutes = require('./game.route');
const DeviceRoutes = require('./device.route');
const SessionRoutes = require('./session.route');
const ActivityRoutes = require('./activity.route');
const UserRoutes = require('./user.route');
const GroupRoutes = require('./group.route');
const ExperimentRoutes = require('./experiment.route');
const ExpDetailsRoutes = require('./expDetails.route');
const ConsentTermRoutes = require('./consentTerm.route');
const LinkRoutes = require('./link.route');
const InitialQuestRoutes = require('./initialQuest.route');
const FormRoutes = require('./form.route');

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
Router.use('/experiment', LogMiddleware, ExperimentRoutes);
Router.use('/expDetails', LogMiddleware, ExpDetailsRoutes);
Router.use('/consentTerm', LogMiddleware, ConsentTermRoutes);
Router.use('/link', LogMiddleware, LinkRoutes);
Router.use('/initialQuest', LogMiddleware, InitialQuestRoutes);
Router.use('/form', LogMiddleware, FormRoutes);

module.exports = Router;

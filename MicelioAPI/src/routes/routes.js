const express = require("express")

const GameRoutes = require("./game.route")
const DeviceRoutes = require("./device.route")
const SessionRoutes = require("./session.route")
const ActivityRoutes = require("./activity.route")
const UserRoutes = require("./user.route")
const GroupRoutes = require("./group.route")
const AboutRoutes = require("./about.route")

const TokenMiddleware = require("../middleware/TokenMiddleware")
const LogMiddleware = require("../middleware/LogMiddleware")

const Router = express.Router()

Router.use("/user", LogMiddleware, UserRoutes)
Router.use("/game", LogMiddleware, GameRoutes)
Router.use("/device", LogMiddleware, TokenMiddleware, DeviceRoutes)
Router.use("/session", LogMiddleware, TokenMiddleware, SessionRoutes)
Router.use("/activity", LogMiddleware, ActivityRoutes)
Router.use("/group", LogMiddleware, GroupRoutes)
Router.use("/about", AboutRoutes)

module.exports = Router

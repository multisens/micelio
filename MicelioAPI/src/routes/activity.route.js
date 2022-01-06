const express = require("express")
const ActivityController = require("../controllers/ActivityController")
const TokenMiddleware = require("../middleware/TokenMiddleware")
const DeviceIDMiddleware = require("../middleware/DeviceIDMiddleware")

const Router = express.Router()
const activityController = new ActivityController()

Router.post("/", TokenMiddleware, DeviceIDMiddleware, activityController.create)
Router.post(
  "/test",
  TokenMiddleware,
  DeviceIDMiddleware,
  activityController.create
)

Router.get("/", activityController.index)

module.exports = Router

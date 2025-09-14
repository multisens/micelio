const express = require("express");
const ProxyController = require("../controllers/ProxyController");
const LogMiddleware = require("../middleware/LogMiddleware");

const Router = express.Router();

Router.get("/image", LogMiddleware, ProxyController.image);

module.exports = Router;
const express = require("express");
const VisualizacaoController = require("./../controllers/VisualizacaoController");

const Router = express.Router();
const visualizacaoController = new VisualizacaoController();

Router.post("/:game_id", visualizacaoController.create);
Router.get("/", visualizacaoController.get);

module.exports = Router;
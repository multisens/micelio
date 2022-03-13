const express = require("express");
const VisualizacaoController = require("./../controllers/VisualizacaoController");

const Router = express.Router();
const visualizacaoController = new VisualizacaoController();

Router.get("/:game_id", visualizacaoController.index);
Router.post("/:game_id", visualizacaoController.create);

module.exports = Router;

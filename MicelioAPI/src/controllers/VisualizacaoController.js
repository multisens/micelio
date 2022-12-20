const knex = require("../database/connection");
const idGenerator = require("../utils/generators/idGenerator");
const {
  decodeUserSession,
} = require("../utils/generators/userSessionGenerator");
const path = require("path");

class VisualizacaoController {
  async get(request, response) {
    const { session_id } = request.params;
    const { visualization_id } = request.query;

    const baseDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "Scripts",
      "MicelioParser",
      "Control Harvest",
      "JsonConverter",
      "Exports"
    );
    return response.status(200).sendFile("sessao212.json", { root: baseDir });
  }

  async index(request, response) {
    //Validação de token
    const { miceliotoken } = request.cookies;
    if (!miceliotoken) {
      return response.status(401).send();
    }

    const { sub: user_id } = decodeUserSession(miceliotoken);
    const { game_id } = request.params;

    try {
      const visualization = await knex("Visualization")
        .select("*")
        .where("user_id", user_id)
        .andWhere("game_id", game_id);

      if (!visualization) {
        return response
          .status(400)
          .json({ error: "Cannot get visualization, try again later" });
      } else {
        return response.status(200).json(visualization);
      }
    } catch (e) {
      return response.status(400).json({ error: e });
    }
  }

  async create(request, response) {
    const { game_id } = request.params;
    let { name, config } = request.body;
    const visualization_id = await idGenerator("Visualization");
    const { miceliotoken } = request.cookies;

    //Validações
    if (!miceliotoken) {
      return response.status(401).send();
    }

    const { sub: user_id } = decodeUserSession(miceliotoken);

    if (!game_id) {
      response.status(400).json({ erro: "invalid game id" });
    }

    if (!name) {
      response.status(400).json({ erro: "invalid name" });
    }

    if (!config) {
      response.status(400).json({ erro: "invalid json config" });
    }

    //VALIDAR PERMISSÃO DO USUARIO

    //Conceções com o Banco
    try {
      name = name.toLowerCase();

      const registeredConfig = await knex("Visualization")
        .select("visualization_id", "name")
        .where("user_id", user_id)
        .andWhere("game_id", game_id)
        .andWhere("name", name)
        .first();

      if (registeredConfig) {
        return response.status(400).json({ error: "Name alredy in use." });
      }

      const data = {
        visualization_id,
        user_id,
        game_id,
        name,
        config,
      };

      const insertVisualization = await knex("Visualization").insert(data);

      if (insertVisualization) {
        return response.status(201).json(data);
      } else {
        return response
          .status(400)
          .json({ error: "Cannot insert user, try again later" });
      }
    } catch (e) {
      console.log(e.message);
      return response
        .status(400)
        .json({ error: "Cannot connect to database, try again later" });
    }
  }
}

module.exports = VisualizacaoController;

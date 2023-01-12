const knex = require("../database/connection");
const jinq = require("jinq");
const idGenerator = require("../utils/generators/idGenerator");
const {
  decodeUserSession,
} = require("../utils/generators/userSessionGenerator");
const path = require("path");

class VisualizacaoController {
  async get(request, response) {
    const { session_id } = request.params;
    const { visualization_id } = request.query;

    const completeSession = await knex("Session as session")
      .select([
        "session.*",
        "act.activity_id",
        "act.name as activity_name",
        "act.time as activity_time",
        "act.properties as activity_properties",
        "influenced.influenced_id as influenced_by",
        "action.position_x as activity_position_x",
        "action.position_y as activity_position_y",
        "ent.entity_id",
        "ent.name as entity_name",
        "ent.properties as entity_properties",
        "gameobj.position_x as entity_position_x",
        "gameobj.position_y as entity_position_y",
        "gamechar.position_x as agent_position_x",
        "gamechar.position_y as agent_position_y",
        "act_ent.properties as entity_properties",
        "act_ent.role as entity_properties",
        "agent.agent_id",
        "agent.name as agent_name",
        "agent.type as agent_type",
        "agent.properties as agent_properties",
        "act_agent.position_x as activity_agent_position_x",
        "act_agent.position_y as activity_agent_position_y",
        "act_agent.properties as activity_agent_properties",
        "act_agent.role as agent_role",
      ])
      .leftJoin("Activity as act", "act.session_id", "session.session_id")
      .leftJoin(
        "ActivityEntities as act_ent",
        "act_ent.activity_id",
        "act.activity_id"
      )
      .leftJoin("Entity as ent", "ent.entity_id", "act_ent.entity_id")
      .leftJoin(
        "ActivityAgents as act_agent",
        "act_agent.activity_id",
        "act.activity_id"
      )
      .leftJoin("Agent as agent", "agent.agent_id", "act_agent.agent_id")
      .leftJoin("Action as action", "action.activity_id", "act.activity_id")
      .leftJoin("GameObject as gameobj", "gameobj.entity_id", "ent.entity_id")
      .leftJoin(
        "GameCharacter as gamechar",
        "gamechar.agent_id",
        "agent.agent_id"
      )
      .leftJoin(
        "InfluencedBy as influenced",
        "influenced.influence_id",
        "act.activity_id"
      )
      .where({ "session.session_id": session_id });

    const activityList = [];

    const result = new jinq()
      .from(completeSession)
      .groupBy("session_id")
      .groupBy("activity_id")
      .select([{ field: "session_id" }]);
    console.log("result", result);
    return response.json(result);

    const finalSession = {
      session_id: completeSession.session_id,
      name: completeSession.name,
      language: completeSession.language,
      game_stage: completeSession.game_stage,
      date: completeSession.date,
      session_group_id: completeSession.session_group_id,
      start_time: completeSession.start_time,
      "end-time": completeSession.end_time,
    };

    return response.status(200).json(finalSession);
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

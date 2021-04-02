const knex = require('../database/connection');

class ActivityController {

  async create(request, response) {
    const {
      activity_id, name, position_x, position_y,
      time, influenced_by, attributes, entities, agents} = request.body;

    if (!activity_id) {
      return response.status(400).json("Invalid activity id");
    }

    if (!name) {
      return response.status(400).json("Invalid activity name");
    }

    if (!time) {
      return response.status(400).json("Invalid activity time");
    }

    if (!agents) {
      return response.status(400).json("Invalid agents");
    }

    if (!entities) {
      return response.status(400).json("Invalid entities");
    }
  }
}

module.exports = ActivityController;

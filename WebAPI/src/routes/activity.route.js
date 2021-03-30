const express = require('express');

const Router = express.Router();

Router.post('/', (request, response) => {
  const {session_id, activity_id, name, position_x, position_y, time, influenced_by, attributes, entities, agents} = request.body;

  response.json({
    session_id,
    activity_id,
    name,
    position_x,
    position_y,
    time,
    influenced_by,
    attributes,
    entities,
    agents
  })

})

module.exports = Router;

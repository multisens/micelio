const express = require('express');

const Router = express.Router();

Router.post('/', (request, response) => {
  const {device_id, system_name, model, screen_width, screen_height} = request.body;

  if(!device_id) {
    return response.status(400).json({error: "Invalid device id"});
  }

  if(!system_name) {
    return response.status(400).json({error: "Invalid system information"});
  }

  if(!model) {
    return response.status(400).json({error: "Invalid device model"});
  }

  if(!screen_width) {
    return response.status(400).json({error: "Invalid screen width"});
  }

  if(!screen_height) {
    return response.status(400).json({error: "Invalid screen height"});
  }

  response.json({
    device_id,
    system_name,
    model,
    screen_width,
    screen_height
  })
})

module.exports = Router;

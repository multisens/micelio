const express = require('express');
const {v4: uuid} = require('uuid');

const Router = express.Router();

Router.post('/', (request, response) => {
  let {name, language, day, month, year, game_stage, start_time} = request.body;

  if(!name) name = null;

  if (!language) {
    return response.status(400).json({error: "Invalid session language"});
  }

  if (!day) {
    return response.status(400).json({error: "Invalid session day"});
  }

  if (!month) {
    return response.status(400).json({error: "Invalid session month"});
  }

  if (!year) {
    return response.status(400).json({error: "Invalid session year"});
  }

  if (!game_stage) {
    return response.status(400).json({error: "Invalid session game stage"});
  }

  if (!start_time) {
    return response.status(400).json({error: "Invalid session start time"});
  }

  const session_id = uuid();

  response.json({
    game_id: "abc",
    session_id,
    name,
    language,
    day,
    month,
    year,
    game_stage,
    start_time,
    end_time: null
  });
})

Router.put('/', (request, response) => {


})

module.exports = Router;

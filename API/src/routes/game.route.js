const {sign}  = require('jsonwebtoken');
const {v4: uuid}  = require('uuid');
const express = require('express');

const Router = express.Router();

Router.post('/', (request, response) => {
  const {name, version} = request.body;

  if(!name || !version){
    return response.status(400).json({error: "Missing name or version"});
  }

  const gameId = uuid();
  const token = sign({}, process.env.JWT_SECRET, {subject: gameId});

  response.json({
    token,
    name,
    version
  })

})

module.exports = Router;

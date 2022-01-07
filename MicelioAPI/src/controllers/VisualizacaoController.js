const express = require("express");
const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator')

class VisualizacaoController {

  async create(request, response){
    
    const {game_id} = request.params;
    let { name, config } = request.body;
    const { miceliotoken } = request.cookies;

    //Validações
    if(!miceliotoken) {
			return response.status(401).send()
		}

    const { sub: userId } = decodeUserSession(miceliotoken)

    if(!game_id){
      request.status(400).json({erro : "invalid game id"})
    }

    if(!name){
      request.status(400).json({erro : "invalid name"})
    }

    if(!config){
      request.status(400).json({erro : "invalid json config"})
    }

    //Conceções com o Banco
    try{
      console.log("sucesso ",game_id);

    }
    catch(err){
      return response.status(400).json({error: 'Cannot connect to database, try again later'});
    }

  }

}

module.exports = VisualizacaoController;
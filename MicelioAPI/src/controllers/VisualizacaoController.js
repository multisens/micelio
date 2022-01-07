const express = require('express');
const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator')

class VisualizacaoController {

  async create(request, response){
    
    const {game_id} = request.params;
    let { name, config } = request.body;
    const visualization_id =  await idGenerator('visualization');
    const { miceliotoken } = request.cookies;

    //Validações
    if(!miceliotoken) {
			return response.status(401).send()
		}

    const { sub: user_id } = decodeUserSession(miceliotoken)

    if(!game_id){
      response.status(400).json({erro : 'invalid game id'})
    }

    if(!name){
      response.status(400).json({erro : 'invalid name'})
    }

    if(!config){
      response.status(400).json({erro : 'invalid json config'})
    }

    //Conceções com o Banco
    try{

      name = name.toLoweCase();

      registeredConfig = await knex('visualization')
      .select('visualization_id', 'name')
      .where('name', name)
      .first()

      if(registeredConfig){
        return response.status(400).json({error : 'Name alredy in use.'});
      }

      const data = {
        visualization_id,
        user_id,
        game_id,
        name,
        config
      }

      const insertVisualization = knex('visualization').insert(data);

      if(insertVisualization){
        return response.send(insertVisualization);
      }else{
        return response.status(400).json({error : 'Cannot insert user, try again later'})
      }
      
    }
    catch(err){
      return response.status(400).json({error: 'Cannot connect to database, try again later'});
    }

  }

}

module.exports = VisualizacaoController;
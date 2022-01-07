const { request } = require('express');
const express = require('express');
const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator')

class VisualizacaoController {

  async get(request, response){

    //Validação de token
    const { miceliotoken } = request.cookies;
    if(!miceliotoken) {
			return response.status(401).send();
		}

    let {name} = request.body;

    if(!name){
      return response.status(400).json({error: 'invalid name'});
    }

    try{
      
      name = name.toLoweCase();

      const visualization = knex('visualization').select().where({name}).first();
      
      if(!visualization){
        return response.status(400).json({error: 'Cannot insert user, try again later'});
      }else{
        return response.send(visualization);
      }

    }catch(e){
      return response.status(400).json({error: 'Cannot connect to database, try again later'});
    }

  }

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
    catch(e){
      return response.status(400).json({error: 'Cannot connect to database, try again later'});
    }

  }

}

module.exports = VisualizacaoController;
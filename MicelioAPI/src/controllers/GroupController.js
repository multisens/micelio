const knex = require('../database/connection');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator')

class GroupController {

  async get(request, response) {
    const {miceliotoken: userToken} = request.cookies
    const decodedToken = decodeUserSession(userToken)

    const user_id = decodedToken.sub;

    // SELECT sg.session_group_id, COUNT(sig.session_group_id) as total_sessions FROM `sessiongroup` as sg
    // LEFT JOIN `sessioningroup` as sig ON sg.session_group_id = sig.session_group_id GROUP BY sg.session_group_id

    const groups = await knex('SessionGroup as sg')
      .select('sg.session_group_id', 'sg.it_ends', 'game.name', 'sg.name as group_name')
      .count('sig.session_group_id as total_sessions')
      .innerJoin('HasPermission as hp', 'hp.has_permission_id', 'sg.has_permission_id')
      .innerJoin('Game as game', 'game.game_id', 'hp.game_id')
      .leftJoin('SessionInGroup as sig', 'sg.session_group_id', 'sig.session_group_id')
      .groupBy('sg.session_group_id')
      .where('hp.user_id', user_id)
    
    console.log(groups)
    response.status(200).json({ok: true, data: groups});
  }

  async create(request, response) {
    const {game_id, name} = request.body;

    //TODO: validação
    if(!game_id){
      return response.status(400).json({error: "Jogo inválido"});
    }

    if(!name) {
      return response.status(400).json({error: "Nome do grupo inválido"});
    }

    const {miceliotoken: userToken} = request.cookies;
    const decodedToken = decodeUserSession(userToken);

    const user_id = decodedToken.sub;

    //TODO: refatorar group id
    const session_group_id = Math.round(Math.random() * 100000);

    const permission_db = await knex('HasPermission')
      .select('has_permission_id')
      .where({user_id, game_id}).first();

    if(!permission_db){
      return response.status(400).json({error: 'Sem permissão'});
    }

    await knex('SessionGroup').insert({
      session_group_id,
      has_permission_id: permission_db.has_permission_id,
      it_ends: 0,
      name
    })

    response.json({ok: true, group_id: session_group_id});
  }

}

module.exports = GroupController;

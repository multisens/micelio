const idGenerator = require('../utils/generators/idGenerator');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator')
const knex = require('../database/connection');

class ShareController {

  async create(request, response){
    const { game_id, user_share } = request.body;

    const {miceliotoken: userToken} = request.cookies;
    const decodedToken = decodeUserSession(userToken);

    const user_id = decodedToken.sub;

    if(!game_id) {
      return response.status(400).json({error: 'Jogo inválido'});
    }

    if(!user_share) {
      return response.status(400).json({error: 'Digite um usuário para compartilhar o jogo'});
    }

    const user_shared = await knex('MicelioUser').select('user_id').where('username', user_share).first();
    if(!user_shared) {
      return response.status(400).json({error: 'Usuário não encontrado'});
    }

    if(user_shared.user_id === user_id) {
      return response.status(400).json({error: 'Não é possível compartilhar o jogo com você mesmo'});
    }

    const user_already_shared = await knex('HasPermission')
      .select()
      .where('game_id', game_id)
      .andWhere('user_id', user_shared.user_id)
      .first();

    if(user_already_shared) {
      return response.status(400).json({error: 'Esse usuário já possuí acesso a este jogo'});
    }

    const new_has_permission_id = await idGenerator('HasPermission', 'has_permission');
    const new_has_permission = await knex('HasPermission').insert({
      has_permission_id: new_has_permission_id,
      user_id: user_shared.user_id,
      game_id,
      owner: 0
    });

    if(!new_has_permission) {
      return response.status(400).json({error: 'Erro ao inserir compartilhamento'});
    }

    response.status(201).send();
  }

}

module.exports = ShareController;

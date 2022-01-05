const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator');

class ExpDetailsController {

    async index(request, response){
        const {experiment_id} = request.params;
        const {miceliotoken: userToken} = request.cookies;
        const decodedToken = decodeUserSession(userToken);
    
        const user_id = decodedToken.sub;
    
    
        const expDetails = await knex('Experiment as e')
          .select('g.token', 'g.name', 'g.version', 'hp.user_id', 'hp.owner', 'mu.username', 'hp.has_permission_id')
          .innerJoin('HasPermission as hp', 'hp.game_id', 'g.game_id')
          .innerJoin("MicelioUser as mu", 'mu.user_id', 'hp.user_id')
          .where('g.game_id', experiment_id)
          .andWhere('hp.user_id', user_id).first();
          //todo: desculpa, precisa ajustar a tabela de haspermission
          // remover coluna "owner", adicionar "user_id" na tabela de game (criador do jogo)
          // paz
    
        if(!game){
          return response.status(400).json({error: "Game not found"});
        }
    
        const expOwner = await knex('Game as g')
          .select('user.username')
          .innerJoin('HasPermission as hp', 'hp.game_id', 'g.game_id')
          .innerJoin('MicelioUser as user', 'user.user_id', 'hp.user_id')
          .where("hp.owner", '1')
          .andWhere('g.game_id', experiment_id).first();
    
        if(!expDetails.owner) {
          delete expDetails.token;
        }
    
        expDetails.username = expOwner.username; //todo:4 perdão, carreira
        //todo: please help
    
        return response.json({expDetails});
    }

}

module.exports = ExpDetailsController;

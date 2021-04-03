const {sign}  = require('jsonwebtoken');
const idGenerator = require('../utils/generators/idGenerator');
const knex = require('../database/connection');

class GameController{
    
	async create(request, response){

        const {user_id, name, version} = request.body;
        
        if(!version){
            return response.status(400).json({error: "Missing game version"});
        }
        if(!name){
            return response.status(400).json({error: "Missing game name"});
        }
        if(!user_id){
            return response.status(400).json({error: "Missing game user id"});
        }

        //TODO: receber o id do usuário e setar a permissão do usuario

        const gameId = await idGenerator('game');
        const token = sign({}, process.env.JWT_SECRET, {subject: gameId});

        const trx = await knex.transaction();
        
        try{

            
            const user = await trx('miceliouser')
            .where('user_id', user_id)
            .select('user_id')
            .first();
            
            
            if(!user){
                return response.status(400).json({error: "Invalid user id"});
            }
            
            const gameData = {
                game_id: gameId,
                token,
                name,
                version
            }

            const game = await trx('game').insert(gameData);

            const permissionData = {
                user_id,
                game_id: gameId,
                owner: true
            }

            const gamePermission = await trx('haspermission').insert(permissionData);

            if(game && gamePermission){
                await trx.commit();
                return response.status(201).json({ok: true});
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: 'Canot insert the game, check the information sent'});
            }
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: err});
        }
        
    }

}

module.exports = GameController;

const {sign}  = require('jsonwebtoken');
const {v4: uuid}  = require('uuid');
const knex = require('../database/connection');

class GameController{
    
	async create(request, response){

        const {name, version} = request.body;
        
        if(!name || !version){
            return response.status(400).json({error: "Missing name or version"});
        }

        const gameId = uuid();
        const token = sign({}, process.env.JWT_SECRET, {subject: gameId});
        
        try{
            const game = await knex('game').insert({
                game_id: gameId,
                token,
                name,
                version
            });

            return response.status(200).json({ok: true});
        }
        catch(err){
            return response.status(400).json({error: err, data: {name, version}});
        }
        
    }

}

module.exports = GameController;

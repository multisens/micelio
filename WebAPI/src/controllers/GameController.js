const {sign}  = require('jsonwebtoken');
const idGenerator = require('../utils/generators/idGenerator');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator')
const knex = require('../database/connection');

class GameController{

  async get(request, response) {
    const {miceliotoken: userToken} = request.cookies
    const decodedToken = decodeUserSession(userToken)

    const user_id = decodedToken.sub;

    const userGames = await knex('HasPermission').innerJoin('Game', 'HasPermission.game_id', 'Game.game_id')
      .select('name', 'version').where('HasPermission.user_id', user_id)


    response.json({ok: true, data: userGames})
  }

	async create(request, response){

        const {name, version} = request.body;
        const { miceliotoken } = request.cookies

        if(!miceliotoken) {
          return response.status(401).send()
        }

        if(!version){
            return response.status(400).json({error: "Missing game version"});
        }

        if(!name){
            return response.status(400).json({error: "Missing game name"});
        }

        const { sub: user_id } = decodeUserSession(miceliotoken)

        if(!user_id){
            return response.status(400).json({error: "Missing game user id"});
        }

        //TODO: receber o id do usuário e setar a permissão do usuario
        const gameId = await idGenerator('Game');
        const token = sign({}, process.env.JWT_SECRET, {subject: gameId});

        const trx = await knex.transaction();

        try{

            const user = await trx('MicelioUser')
            .where('user_id', user_id)
            .select('user_id')
            .first();


            if(!user){
                return response.status(400).json({error: "Invalid user id"});
            }

            const insetedGame = await trx('Game')
            .where('name', name)
            .andWhere('version', version)
            .select('game_id')
            .first();

            if(insetedGame){
                return response.status(400).json({error: "This game already exists"});
            }

            const gameData = {
                game_id: gameId,
                token,
                name,
                version
            }

            const game = await trx('Game').insert(gameData);

            const has_permission_id = await idGenerator('HasPermission', 'has_permission');

            const permissionData = {
                has_permission_id,
                user_id,
                game_id: gameId,
                owner: true
            }

            const gamePermission = await trx('HasPermission').insert(permissionData);

            if(game && gamePermission){
                await trx.commit();
                return response.status(201).json({ok: true});
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: 'Cannot insert the game, check the information sent'});
            }
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: 'Cannot insert the game, try again later'});
        }

    }

}

module.exports = GameController;

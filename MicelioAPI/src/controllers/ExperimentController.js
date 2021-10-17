const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator');

class ExperimentController {

	async get(request, response) {

        const {miceliotoken: userToken} = request.cookies;
        const decodedToken = decodeUserSession(userToken);

        const user_id = decodedToken.sub;

        const userExperiments = await knex('Experiment as e')
          .select('e.experiment_id', 'e.txt_experient_name', 'g.name as gameName')
          .innerJoin('HasExpPermission as hep', 'hep.experiment_id', 'e.experiment_id')
          .innerJoin('MicelioUser as mu', 'mu.user_id', 'hep.user_id')
          .innerJoin('Game as g', 'g.game_id', 'e.game_id')
          .where('mu.user_id', user_id)
          .first();
        
        if (!userExperiments) {
            return response.status(400).json({error: "Experiment not found"});
        }
    
        response.json({ok: true, data: userExperiments[0]});
	}

	async create(request, response) {

        const {nameExperiment, nameGame} = request.body;
        const { miceliotoken } = request.cookies

        if(!miceliotoken) {
          return response.status(401).send();
        }

        if(!nameGame){
            return response.status(400).json({error: "Missing game name"});
        }

        if(!nameExperiment){
            return response.status(400).json({error: "Missing experiment name"});
        }

        const { sub: user_id } = decodeUserSession(miceliotoken)

        if(!user_id){
            return response.status(400).json({error: "Missing experiment user id"});
        }

        //TODO: receber o id do usuário e setar a permissão do usuario
        const experimentId = await idGenerator('Experiment');

        const trx = await knex.transaction();

        try{

            const user = await trx('MicelioUser')
                              .where('user_id', user_id)
                              .select('user_id')
                              .first();

            if(!user){
                return response.status(400).json({error: "Invalid user id"});
            }

            const insertedExperiment = await trx('Experiment')
                                            .where('txt_experient_name', nameExperiment)
                                            .select('experiment_id')
                                            .first();

            if(insertedExperiment){
                return response.status(400).json({error: "This experiment already exists"});
            }

            const gameId = await trx('Game')
                                .where('name', nameGame)
                                .select('game_id')
                                .first()

            if(!gameId){
                return response.status(400).json({error: "This game does not exist"});
            }

            const gamePermission = await trx('hasPermission')
                                        .where('user_id', user)
                                        .and('game_id', gameId)
                                        .first()
            
            if(!gamePermission){
                return response.status(400).json({error: "User does not have permission to this game"});
            }

            const experimentData = {
                experiment_id: experimentId,
                txt_experient_name: nameExperiment,
                game_id: gameId,
                user_id: user
            }

            const experiment = await trx('Experiment').insert(experimentData);

            const has_exp_permission_id = await idGenerator('hasExpPermission', 'has_exp_permission');

            const permissionData = {
                has_exp_permission_id,
                user_id: user,
                experiment_id: experimentId,
            }

            const expPermission = await trx('hasExpPermission').insert(permissionData);

            if(experiment && expPermission){
                await trx.commit();
                return response.status(201).json({ok: true});
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: 'Cannot insert the experiment, check the information sent'});
            }
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: 'Cannot insert the experiment, try again later'});
        }

    }

}

module.exports = ExperimentController;

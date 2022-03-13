const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const { decodeUserSession } = require('../utils/generators/userSessionGenerator');

class ExperimentController {

	async get(request, response) {

        const {miceliotoken: userToken} = request.cookies;
        const decodedToken = decodeUserSession(userToken);

        const user_id = decodedToken.sub;

        const userExperiments = await knex('Experiment as e')
          .select('e.experiment_id', 'e.txt_experiment_name', 'g.name as gameName')
          .innerJoin('HasExpPermission as hep', 'hep.experiment_id', 'e.experiment_id')
          .innerJoin('MicelioUser as mu', 'mu.user_id', 'hep.user_id')
          .innerJoin('Game as g', 'g.game_id', 'e.game_id')
          .where('mu.user_id', user_id);
    
        response.json({ok: true, data: userExperiments});
	}

	async create(request, response) {

        const {nameExperiment, nameGame} = request.body;
        const {miceliotoken: userToken} = request.cookies;
        const decodedToken = decodeUserSession(userToken);

        const user_id = decodedToken.sub;

        if(!nameGame){
            return response.status(400).json({error: "Missing game name"});
        }

        if(!nameExperiment){
            return response.status(400).json({error: "Missing experiment name"});
        }

        const experimentId = await idGenerator('Experiment');

        const trx = await knex.transaction();

        try{

            const insertedExperiment = await trx('Experiment')
                                            .where('txt_experiment_name', nameExperiment)
                                            .select('experiment_id')
                                            .first();

            if(insertedExperiment){
                return response.status(400).json({error: "This experiment already exists"});
            }

            const {game_id} = await trx('Game')
                                .where('name', nameGame)
                                .select('game_id')
                                .first();

            if(!game_id){
                return response.status(400).json({error: "This game does not exist"});
            }

            const {has_permission_id} = await trx('HasPermission')
                                        .where('user_id', user_id)
                                        .andWhere('game_id', game_id)
                                        .select('has_permission_id')
                                        .first();
                                        
            if(!has_permission_id){
                return response.status(400).json({error: "User does not have permission to this game"});
            }

            const experimentData = {
                experiment_id: experimentId,
                txt_experiment_name: nameExperiment,
                game_id,
                user_id
            }

            const experiment = await trx('Experiment').insert(experimentData);

            const has_exp_permission_id = await idGenerator('HasExpPermission', 'has_exp_permission');

            const permissionData = {
                has_exp_permission_id,
                user_id,
                experiment_id: experimentId,
            }

            const expPermission = await trx('HasExpPermission').insert(permissionData);

            for(let i=1;i<=4;i++){

                const groupData = {
                    experiment_id: experimentId,
                    num_part_total: 0,
                    group_id: i
                }

                const groupInsert = await trx('ExpGroup').insert(groupData);

                if(!groupInsert){
                    await trx.rollback();
                    return response.status(400).json({error: 'Cannot insert the group, something went wrong'});
                }
            }
            
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

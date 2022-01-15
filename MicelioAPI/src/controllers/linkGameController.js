const knex = require('../database/connection');

class LinkGameController {

	async get(request, response) {

        const {experiment_id} = request.params;

        const {txt_consent_term} = await knex('Experiment as e')
                                        .select('e.txt_consent_term')
                                        .where('e.experiment_id', experiment_id)
                                        .first();
    
        response.json({ok: true, data: txt_consent_term});
	}

	async update(request, response) {

        const {experiment_id} = request.params;
        const {txt_consent_term} = request.body;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        if(!txt_consent_term){
            return response.status(400).json({error: "Missing consent term"});
        }

        const trx = await knex.transaction();

        try{

            const experiment = await trx('Experiment').where('experiment_id', experiment_id).update({txt_consent_term: txt_consent_term});

            if(experiment){
                await trx.commit();
                return response.status(201).json({ok: true});
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: 'Cannot update the experiment, check the information sent'});
            }
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: 'Cannot update the experiment, try again later'});
        }
    }
}

module.exports = LinkGameController;

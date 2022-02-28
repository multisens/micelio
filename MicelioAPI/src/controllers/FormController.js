const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class FormController {

    async get(request, response) {
        const {experiment_id} = request.params;

        const {txt_consent_term} = await knex('Experiment as e')
                                        .select('e.txt_consent_term')
                                        .where('e.experiment_id', experiment_id)
                                        .first();

        return response.json({ok: true, data: txt_consent_term});
    }
	

	async create(request, response) {

        const {experiment_id} = request.params
        const {username, email} = request.body;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        if(!username || !email){
            return response.status(400).json({error: "Missing username or email"});
        }

        const part_id = await knex('Participant')
                             .select('participant_id')
                             .where('txt_email', email)
                             .andWhere('experiment_id', experiment_id)
                             .first();

        if(part_id){
            return response.status(201).json({ok: true, participant_id: part_id.participant_id});
        }

		const participant_id = await idGenerator('Participant');

        const trx = await knex.transaction();

        try{
            let count = 0;
            const {group_id, num_part_total} = await knex('Exp_group')
                                                    .select('group_id', 'num_part_total')
                                                    .orderBy(['num_part_total', { column: 'group_id', order: 'asc' }])
                                                    .first();

            const userData = {
                participant_id,
                txt_name: username,
                txt_email: email,
                group_id,
                experiment_id
            }

			const userInsert = await trx('participant').insert(userData);

            count = num_part_total + 1;

            const groupAdd = await trx('Exp_group').where('group_id', group_id).update('num_part_total', count);

            if(userInsert && groupAdd){
                await trx.commit();
                return response.status(201).json({ok: true, participant_id});
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: 'Cannot insert the participant, check the information sent'});
            }
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: 'Something went wrong, try again later'});
        }
	}
}

module.exports = FormController;

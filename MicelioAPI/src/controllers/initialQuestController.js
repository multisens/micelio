const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class InitialQuestController {

    async get(request, response) {

        const {experiment_id} = request.params;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        const form = await knex('Form as f')
                          .select('f.form_id')
                          .where('f.ind_stage', 'I')
                          .andWhere('f.experiment_id', experiment_id)
                          .first();

        if (!form) {
            return response.json({ok: 'no_data_found'});
        }

        const [questions] = await knex('Questions as q')
                                 .select('q.txt_question', 'q.question_id')
                                 .where('q.form_id', form.form_id)
                                 .orderBy('q.ind_order')

        response.json({ok: true, questions});
	}

	async update(request, response) {

        const {experiment_id} = request.params;
        const {question, order} = request.body;
        const selected = 'I';

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        const form = await knex('Form as f')
                          .select('f.form_id')
                          .where('f.experiment_id', experiment_id)
                          .andWhere('f.ind_stage', selected)
                          .first();

        const trx = await knex.transaction();

        try{

            if(!form){
                const form_id = await idGenerator('form');

                form.form_id = form_id;

                const formData = {
                    form_id,
                    ind_stage: selected,
                    experiment_id
                };

                const formInsert = await trx('form').insert(formData);

                if(formInsert){
                    await trx.commit();
                    return response.status(201).json({ok: true});
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                }
            }
            
            const question_aux = await knex('Questions as q')
                                .select('q.txt_question', 'q.ind_order')
                                .where('q.form_id', form.form_id)
                                .first();

            if(!question_aux) {

                const question_id = await idGenerator('Questions', 'question');

                const questionData = {
                    question_id,
                    txt_question: question,
                    ind_type: 'D',
                    ind_order: order,
                    form_id: form.form_id
                };

                const questionInsert = await trx('Questions').insert(questionData);

                if(questionInsert){
                    await trx.commit();
                    return response.status(201).json({ok: true});
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                }
            } else {
                const quenstionUpdate = await trx('Questions').where('form_id', form.form_id).andWhere('ind_order', question_aux.ind_order).update({txt_question: question, ind_type: 'D'});

                if(quenstionUpdate){
                    await trx.commit();
                    return response.status(201).json({ok: true});
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                }
            }
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: 'Cannot update the game page, try again later'});
        }
    }
}

module.exports = InitialQuestController;

const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class InitialFormController {

    async get(request, response) {

        const {experiment_id} = request.params;
        const {email} = request.body;

        console.log(email);

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        const {form_id} = await knex('Form as f')
                               .select('f.form_id')
                               .where('f.ind_stage', 'I')
                               .andWhere('f.experiment_id', experiment_id)
                               .first();

        if (!form_id) {
            return response.json({ok: 'no_data_found'});
        }

        const questions = await knex('Questions as q')
                                 .select('q.txt_question')
                                 .where('q.form_id', form_id)
                                 .orderBy('q.ind_order')

        const questionsAux = JSON.parse(JSON.stringify(questions));

        let questionsArray = [];

        if (questions) {
            for (let i=0;i<questionsAux.length;i++) {
                questionsArray.push(questionsAux[i].txt_question)
            }
        }
        response.json(questionsArray);
    }

    async update(request, response) {

        const {experiment_id} = request.params;
        const {question, order} = request.body;
        const selected = 'I';

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        let {form_id} = await knex('Form as f')
                             .where('f.experiment_id', experiment_id)
                             .andWhere('f.ind_stage', selected)
                             .select('f.form_id')
                             .first();

        const trx = await knex.transaction();

        try{
            const form_id_gen = await idGenerator('form');

            if(!form_id){
                form_id = form_id_gen;

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
            
            const questions_aux = await knex('Questions as q')
                                       .where('q.form_id', form_id)
                                       .select('q.ind_order')
                                       .orderBy('q.ind_order');
            
            const questionAuxList = JSON.parse(JSON.stringify(questions_aux));

            if (!questionAuxList[order]) {
                const question_id = await idGenerator('Questions', 'question');

                const questionData = {
                    question_id,
                    txt_question: question,
                    ind_type: 'D',
                    ind_order: order,
                    form_id
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
            } else
            if (questionAuxList[order].ind_order === order) {
                const questionUpdate = await trx('Questions as q').where('q.ind_order', order).update('q.txt_question', question);

                if(questionUpdate){
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

module.exports = InitialFormController;

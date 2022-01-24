const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class QuizController {

	async get(request, response) {

        const {experiment_id} = request.params;
    
        response.json({ok: true});
	}

	async update(request, response) {

        const {experiment_id} = request.params;
        const {selected, question, selectedOpt} = request.body;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        const form = await knex('Form as f')
                          .select('f.form_id')
                          .where('f.experiment_id', experiment_id)
                          .andWhere('f.ind_stage', selected)
                          .first();

        if(selected === 'I') {

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
                
                if (selectedOpt === 'D') {
                    const question_aux = await knex('Questions as q')
                                        .select('q.txt_question', 'q.question_id')
                                        .where('q.form_id', form.form_id)
                                        .first();

                    if(!question_aux) {

                        const question_id = await idGenerator('Questions', 'question');

                        const questionData = {
                            question_id,
                            txt_question: question,
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
                        const quenstionUpdate = await trx('Questions').where('form_id', form.form_id).andWhere('question_id', question_aux.question_id).update({txt_question: question});

                        if(quenstionUpdate){
                            await trx.commit();
                            return response.status(201).json({ok: true});
                        }
                        else{
                            await trx.rollback();
                            return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                        }
                    }
                } else {
                    //Não implementado
                    return response.status(400).json({error: 'Cannot update the question, check the information sent'});
                }
            }
            catch(err){
                await trx.rollback();
                return response.status(400).json({error: 'Cannot update the game page, try again later'});
            }
        } else if (selected === 'E') {
            return response.status(201).json({ok: true});
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
                
                if (selectedOpt === 'D') {
                    const question_aux = await knex('Questions as q')
                                        .select('q.txt_question', 'q.question_id')
                                        .where('q.form_id', form.form_id)
                                        .first();

                    if(!question_aux) {

                        const question_id = await idGenerator('Questions', 'question');

                        const questionData = {
                            question_id,
                            txt_question: question,
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
                        const quenstionUpdate = await trx('Questions').where('form_id', form.form_id).andWhere('question_id', question_aux.question_id).update({txt_question: question});

                        if(quenstionUpdate){
                            await trx.commit();
                            return response.status(201).json({ok: true});
                        }
                        else{
                            await trx.rollback();
                            return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                        }
                    }
                } else {
                    //Não implementado
                    return response.status(400).json({error: 'Cannot update the question, check the information sent'});
                }
            }
            catch(err){
                await trx.rollback();
                return response.status(400).json({error: 'Cannot update the game page, try again later'});
            }
        } else {
            return response.status(201).json({ok: true});
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
                
                if (selectedOpt === 'D') {
                    const question_aux = await knex('Questions as q')
                                        .select('q.txt_question', 'q.question_id')
                                        .where('q.form_id', form.form_id)
                                        .first();

                    if(!question_aux) {

                        const question_id = await idGenerator('Questions', 'question');

                        const questionData = {
                            question_id,
                            txt_question: question,
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
                        const quenstionUpdate = await trx('Questions').where('form_id', form.form_id).andWhere('question_id', question_aux.question_id).update({txt_question: question});

                        if(quenstionUpdate){
                            await trx.commit();
                            return response.status(201).json({ok: true});
                        }
                        else{
                            await trx.rollback();
                            return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                        }
                    }
                } else {
                    //Não implementado
                    return response.status(400).json({error: 'Cannot update the question, check the information sent'});
                }
            }
            catch(err){
                await trx.rollback();
                return response.status(400).json({error: 'Cannot update the game page, try again later'});
            }
        }
    }
}

module.exports = QuizController;

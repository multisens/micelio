const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

// ESSE CONTROLLER TANTO QUANTO OS OUTROS QUESTCONTROLLERS PODEM MIGRAR PARA 1 SÓ,
// NÃO FIZ PORQUE IA DAR TRABALHO E MEU TEMPO ACABOU, FOI MAL
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
            return response.json([]);
        }
        
        const form_id = form.form_id;

        const questions = await knex('Questions as q')
                                 .select('q.question_id', 'q.txt_question', 'q.ind_type')
                                 .where('q.form_id', form_id)
                                 .orderBy('q.ind_order')

        const questionsAux = JSON.parse(JSON.stringify(questions));

        for (let i=0;i<questionsAux.length;i++) {
            const options = await knex('Options as o')
                                 .select('o.txt_option')
                                 .where('o.question_id', questionsAux[i].question_id);
            
            if (options.length > 0) {
                const optionsAux = JSON.parse(JSON.stringify(options));

                questionsAux[i].options = optionsAux.map(o => o.txt_option);
            } else {
                questionsAux[i].options = [''];
            }
        }

        response.json({questions: questionsAux});
	}

    async update(request, response) {

        const {experiment_id} = request.params;
        const {question, order, length, hasOption, options} = request.body;
        const selected = 'I';

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        const form = await knex('Form as f')
                          .where('f.experiment_id', experiment_id)
                          .andWhere('f.ind_stage', selected)
                          .select('f.form_id')
                          .first();

        try{
            const form_id_gen = await idGenerator('Form');

            let form_id = '';

            if(!form){

                const trx = await knex.transaction();

                form_id = form_id_gen;

                const formData = {
                    form_id,
                    ind_stage: selected,
                    experiment_id
                };

                const formInsert = await trx('Form').insert(formData);

                if(formInsert){
                    await trx.commit();
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: 'Cannot insert the forms.'});
                }
            }

            if(form_id === '') {
                form_id = form.form_id;
            }
            
            const questions_aux = await knex('Questions as q')
                                       .where('q.form_id', form_id)
                                       .select('q.ind_order')
                                       .orderBy('q.ind_order');
            
            const questionAuxList = JSON.parse(JSON.stringify(questions_aux));

            if (!questionAuxList[order]) {

                console.log('Insert')
                const trx = await knex.transaction();

                const question_id = await idGenerator('Questions', 'question');

                const questionData = {
                    question_id,
                    txt_question: question,
                    ind_type: hasOption,
                    ind_order: order,
                    form_id
                };

                const questionInsert = await trx('Questions').insert(questionData);
                
                if(questionInsert){
                    await trx.commit();
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: `Cannot insert the question ${order+1}`});
                }

                if (options.length > 0 && hasOption === 'O') {
                    for (let i=0; i<options.length; i++) {

                        const trx2 = await knex.transaction();
                        
                        const options_id = await idGenerator('Options', 'options');

                        const optionsData = {
                            options_id,
                            txt_option: options[i],
                            ind_order: i,
                            question_id
                        }

                        await trx2('Options').insert(optionsData);
                        if(questionInsert){
                            await trx2.commit();
                        }
                        else{
                            await trx2.rollback();
                            return response.status(400).json({error: `Cannot insert the option ${i+1} from the question ${order+1}`});
                        }
                    }
                }

            } else
            if (questionAuxList[order].ind_order === order) {

                console.log('Update')

                const {question_id} = await knex('Questions as q')
                                       .select('q.question_id')
                                       .where('q.ind_order', order)
                                       .andWhere('q.form_id', form_id)
                                       .first();

                console.log(question_id)

                const optionsQi = await knex('Options as o')
                                       .select('o.question_id as optionsQi')
                                       .where('o.question_id', question_id);

                console.log(optionsQi)

                if (optionsQi.length > 0) {
                    const trx = await knex.transaction();

                    const optionsDelete = await trx('Options').delete().where('question_id', question_id);

                    if (optionsDelete) {
                        await trx.commit();
                    } else {
                        await trx.rollback();
                        return response.status(400).json({error: `Cannot delete the options in the question ${order+1}`});
                    }
                }
                if (options.length > 0 && hasOption === 'O') {
                    for (let i=0; i<options.length; i++) {

                        const trx = await knex.transaction();
                        
                        const options_id = await idGenerator('Options', 'options');

                        const optionsData = {
                            options_id,
                            txt_option: options[i],
                            ind_order: i,
                            question_id
                        }

                        const optionsInsert = await trx('Options').insert(optionsData);

                        if (optionsInsert) {
                            await trx.commit();
                        }
                        else{
                            await trx.rollback();
                            return response.status(400).json({error: `Cannot insert the option ${i+1} in the question ${order+1}`});
                        }
                    }
                }
                const trx = await knex.transaction();

                const questionUpdate = await trx('Questions as q').where('q.question_id', question_id)
                                            .update({txt_question: question, ind_type: hasOption});

                if(questionUpdate){
                    await trx.commit();
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: `Cannot update the question ${order+1}`});
                }
            }

            if (questionAuxList.length > length && order === length-1) {
                console.log('Delete')

                const questions = await knex('Questions as q')
                                           .select('q.question_id')
                                           .where('q.ind_order', '>=', length)
                                           .andWhere('q.form_id', form_id);

                const questionsAux = JSON.parse(JSON.stringify(questions));

                const qA = questionsAux.map(q => q.question_id)

                const options = await knex('Options as o')
                                     .select('o.question_id')
                                     .whereIn('question_id', qA);

                const optionsAux = JSON.parse(JSON.stringify(options));

                const oA = optionsAux.map(o => o.question_id)
                
                if(oA.length > 0){
                    const trx = await knex.transaction();

                    const optionsDelete = await trx('Options').delete().whereIn('question_id', oA);

                    console.log(oA)
                    if(optionsDelete){
                        await trx.commit();
                    }
                    else {
                        await trx.rollback();
                        return response.status(400).json({error: `Cannot delete the options ${order+1}`});
                    }
                }

                console.log(qA)
                
                const trx = await knex.transaction();

                const questionsDelete = await trx('Questions').delete().whereIn('question_id', qA);

                console.log('chegou aqui')

                if(questionsDelete){
                    await trx.commit();
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: `Cannot delete the questions`});
                }
            }
            return response.status(201).json({ok: true});
        }
        catch(err){
            return response.status(400).json({error: 'Something went wrong, try again later'});
        }
    }
}

module.exports = InitialQuestController;

const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class FinalFormController {

    async get(request, response) {

        const {experiment_id, participant_id} = request.params;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        const form = await knex('Form as f')
                          .select('f.form_id')
                          .where('f.ind_stage', 'F')
                          .andWhere('f.experiment_id', experiment_id)
                          .first();

        if (!form) {
            return response.json([]);
        }
        
        const form_id = form.form_id;

        const questions = await knex('Questions as q')
                                 .select('q.txt_question', 'q.question_id')
                                 .where('q.form_id', form_id)
                                 .orderBy('q.ind_order')

        const questionsAux = JSON.parse(JSON.stringify(questions));

        let questionsArray = [];
        let answersArray = [];

        if (questions) {
            for (let i=0;i<questionsAux.length;i++) {
                questionsArray.push(questionsAux[i].txt_question)

                const answers = await knex('Answers as a')
                                     .select('a.txt_answer')
                                     .where('a.participant_id', participant_id)
                                     .andWhere('a.question_id', questionsAux[i].question_id)
                                     .first();

                if(!answers){
                    answersArray.push('');
                } else {
                    answersArray.push(answers.txt_answer);
                }
            }
        }

        const {group_id} = await knex('Participant as p')
                               .select('p.group_id')
                               .where('p.participant_id', participant_id)
                               .andWhere('p.experiment_id', experiment_id)
                               .first();

        response.json({questions: questionsArray, answers: answersArray, groupId: group_id});
    }

    async update(request, response) {

        const {experiment_id} = request.params;
        const {answer, order, participant_id} = request.body;
        const selected = 'F';

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        const {form_id} = await knex('Form as f')
                            .where('f.experiment_id', experiment_id)
                            .andWhere('f.ind_stage', selected)
                            .select('f.form_id')
                            .first();

        const trx = await knex.transaction();

        try{

            const {question_id} = await knex('Questions as q')
                                         .where('q.form_id', form_id)
                                         .andWhere('q.ind_order', order)
                                         .select('q.question_id')
                                         .first();

            const hasAnswer = await knex('Answers as a')
                                   .where('a.question_id', question_id)
                                   .andWhere('a.participant_id', participant_id)
                                   .select('a.answer_id')
                                   .first();

            if (!hasAnswer) {
                const gen_answer_id = await idGenerator('Questions', 'question');

                const answerData = {
                    answer_id: gen_answer_id,
                    txt_answer: answer,
                    ind_option: null,
                    question_id,
                    participant_id
                };

                const answerInsert = await trx('Answers').insert(answerData);

                if(answerInsert){
                    await trx.commit();
                    return response.status(201).json({ok: true});
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: 'Cannot update the game page, check the information sent'});
                }
            } else {
                const questionUpdate = await trx('Answers as a').where('a.answer_id', hasAnswer.answer_id).update('a.txt_answer', answer);

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

module.exports = FinalFormController;

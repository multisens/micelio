const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class SessionController{

	async create(request, response){

        let {name, language, date, game_stage, session_group, start_time} = request.body;

        let {game_id, device_id} = request.headers;

        const end_time = null;

        if(!name) name = null;

        if (!language) {
            return response.status(400).json({error: "Invalid session language"});
        }

        if (!date) {
            return response.status(400).json({error: "Invalid session day"});
        }

        if (!game_stage) {
            return response.status(400).json({error: "Invalid session game stage"});
        }

        if (!start_time) {
            return response.status(400).json({error: "Invalid session start time"});
        }

        const sessionId = await idGenerator('Session');

        const trx = await knex.transaction();

        try{

            const data = {
                game_id,
                device_id,
                session_id: sessionId,
                name,
                language,
                date,
                game_stage,
                start_time,
                end_time
            }

            const session = await trx('Session').insert(data);

            if(session_group){
                const group = await trx('SessionGroup')
                .where('session_group_id', session_group)
                .select('session_group_id')
                .first()

                if(group){
                    await trx('SessionInGroup').insert({session_id: sessionId, session_group_id: session_group});
                }
            }

            if(session){
                trx.commit();
                return response.status(201).json({ok: true});
            }
            else{
                return response.status(400).json({error: 'Cannot insert session, try again later'});
            }

        }
        catch(err){
            trx.rollback();
            return response.status(400).json({error: "Cannot insert, please check the acess token and the device id."});
        }

    }

    async update(request, response){

        const {end_time} = request.body;

        const {game_id, device_id} = request.headers;

        if (!end_time) {
            return response.status(400).json({error: "Invalid session end time"});
        }

        const trx = await knex.transaction();

        try{

            const { session_id } = await trx('Session')
            .where('device_id', device_id)
            .andWhere('game_id', game_id)
            .andWhere('end_time', null)
            .orderBy([{ column: 'date', order: 'desc'}, { column: 'start_time', order: 'desc' }])
            .select('session_id')
            .first();

            if(session_id){
                const sessionUpdated = await trx('Session')
                .update('end_time', end_time)
                .where('session_id', session_id);
                
                if(sessionUpdated){
                    await trx.commit();
                    return response.status(201).json({ok: true});
                }
                else{
                    await trx.rollback();
                    return response.status(400).json({error: "Cannot end session, check the information sent"});
                }
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: "You dont have any opened session"});
            }
            
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: "Cannot end session, check the information sent."});
        }

    }
}

module.exports = SessionController;

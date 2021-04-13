const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class SessionController{

	async create(request, response){

        let {name, language, date, game_stage, room, start_time} = request.body;

        let {game_id, device_id} = request.headers;

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

        const sessionId = await idGenerator('session');

        try{

            const data = {
                game_id,
                device_id,
                session_id: sessionId,
                name,
                language,
                date,
                game_stage,
                room,
                start_time,
                end_time: null
            }

            const session = await knex('session').insert(data);

            if(session){
                return response.status(201).json({ok: true});
            }
            else{
                return response.status(400).json({error: session});
            }

        }
        catch(err){
            return response.status(400).json({error: err});
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

            const { session_id } = await trx('session')
            .where('device_id', device_id)
            .andWhere('game_id', game_id)
            .orderBy([{ column: 'date', order: 'desc'}, { column: 'start_time', order: 'desc' }])
            .select('session_id')
            .first();

            const sessionUpdated = await trx('session')
            .update('end_time', end_time)
            .where('session_id', session_id);

            if(sessionUpdated){
                await trx.commit();
                return response.status(201).json({ok: true});
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: "Canot end session, check the information sent"});
            }


        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: "Canot end session, check the information sent."});
        }

    }
}

module.exports = SessionController;

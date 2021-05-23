const knex = require('../database/connection');

class ActivityController {

	async create(request, response){

		let {activity_id,name, position_x, position_y,
				time, influenced_by, influenced_by_properties, properties
				, entities, agents } = request.body;

		const {game_id, device_id} = request.headers;

		if (!activity_id) {
			return response.status(400).json("Invalid activity id");
		}

		if (!name) {
			return response.status(400).json("Invalid activity name");
		}

		if (!time) {
			return response.status(400).json("Invalid activity time");
		}

		if (!agents) {
			return response.status(400).json("Invalid agents");
		}
		else{
			if(agents instanceof Array){
				const agentsHasProps = agents.map((agent)=>{
					if(agent.agent_id && agent.name && agent.type && agent.role){
						return true;
					}
					else{
						return false;
					}
				});
				if(agentsHasProps.indexOf(false) != -1){
					return response.status(400).json("Invalid agents attributes");
				}								
			}
			else{
				return response.status(400).json("Invalid agents");
			}
		}

		if (!entities) {
			return response.status(400).json("Invalid entities");
		}
		else{
			const entitesHasProps = entities.map((entity)=>{
				if(entity.entity_id && entity.name && entity.role){
					return true;
				}
				else{
					return false;
				}
			});
			if(entitesHasProps.indexOf(false) != -1){
				return response.status(400).json("Invalid entities attributes");
			}	
		}

		if(request.url === '/test'){
			return response.status(202).json({ok: true});
		}

		const trx = await knex.transaction();

        try{

			const { session_id } = await trx('Session')
            .where('device_id', device_id)
            .andWhere('game_id', game_id)
            .orderBy([{ column: 'date', order: 'desc'}, { column: 'start_time', order: 'desc' }])
            .select('session_id')
            .first();
			
			const data = {
				session_id,
				activity_id,
				name,
				position_x,
				position_y,
				time,
				influenced_by,
				influenced_by_properties,
				properties: JSON.stringify(properties),
				entities,
				agents,
			}
			
            return response.status(201).json(data);


        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: err});
        }

	}
}

module.exports = ActivityController;

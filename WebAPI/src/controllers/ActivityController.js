const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class ActivityController {

	async create(request, response){

		let {activity_id, name, position_x, position_y,
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
					return response.status(400).json("Invalid agents attributes, please check the following information: agent_id, name, type and role.");
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
				return response.status(400).json("Invalid entities attributes, please check the following information: entity_id, name and role.");
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
			
			const activity_data = {
				session_id,
				activity_id,
				name, 
				time,
				properties
			};

			const inserted_activity = await trx('Activity').insert(activity_data);

			if(position_x && position_y){

				const action_data = {
					activity_id,
					position_x,
					position_y		
				};
				const inserted_activity = await trx('Action').insert(action_data);

			}

			if(influenced_by){

				const influenced_by_id = await idGenerator('InfluencedBy', 'influenced_by');
				const influenced_by_data = {
					influenced_by_id,
					influence: influenced_by,
					influenced: activity_id,
					properties: influenced_by_properties
				}
				const inserted_activity = await trx('Action').insert(action_data);

			}

			

           // ENTITY 
		   // AGENT
		   // GAME OBJECT
		   // GAME CHARACTER
		   // ACTIVITY AGENTS
		   // ACTIVITY ENTITIES
			

        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: err});
        }

	}
}

module.exports = ActivityController;

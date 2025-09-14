const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');
const path = require('path');
const fs = require('fs');

class ActivityController {

	async create(request, response) {

		let { activity_id, name, position_x, position_y,
			position_z, time, influenced_by, influenced_by_properties,
			properties, entities, agents } = request.body;

		const { game_id, device_id } = request.headers;

		//TODO: validação
		if (!activity_id) {
			console.error(`[ERRO VALIDAÇÃO ATIVIDADE] Não foi possível encontrar o identificador da atividade:\n` +
				`activity_id: ${request.body.activity_id}\n` +
				`body:${JSON.stringify(request.body, null, 2)}`);
			return response.status(400).json("Invalid activity id");
		}

		if (!name) {
			console.error(`[ERRO VALIDAÇÃO ATIVIDADE] Não foi possível encontrar o nome da atividade:\n` +
				`name: ${request.body.name}\n` +
				`body:${JSON.stringify(request.body, null, 2)}`);
			return response.status(400).json("Invalid activity name");
		}

		if (!time) {
			console.error(`[ERRO VALIDAÇÃO ATIVIDADE] Não foi possível encontrar o tempo da atividade:\n` +
				`time: ${request.body.time}\n` +
				`body:${JSON.stringify(request.body, null, 2)}`);
			return response.status(400).json("Invalid activity time");
		}

		//valida agents
		if (!agents) {
			console.error(`[ERRO VALIDAÇÃO ATIVIDADE] Não foi possível encontrar a lista de agentes:\n` +
				`agents: ${JSON.stringify(request.body.agents, null, 2)}\n` +
				`body:${JSON.stringify(request.body, null, 2)}`);
			return response.status(400).json("Invalid agents");
		}
		else {
			if (agents instanceof Array) {
				const agentsHasProps = agents.map((agent) => {
					if (agent.agent_id && agent.name && agent.type && agent.role) {
						return true;
					}
					else {
						return false;
					}
				});
				if (agentsHasProps.indexOf(false) != -1) {
					console.error(`[ERRO VALIDAÇÃO ATIVIDADE] Os agentes não estão de acordo com as regras:\n` +
						`agents: ${JSON.stringify(request.body.agents, null, 2)}\n` +
						`body:${JSON.stringify(request.body, null, 2)}`);
					return response.status(400).json("Invalid agents attributes, please check the following information: agent_id, name, type and role.");
				}
			}
			else {
				console.error(`[ERRO VALIDAÇÃO ATIVIDADE] Não foi possível encontrar a lista de agentes:\n` +
					`agents: ${JSON.stringify(request.body.agents, null, 2)}\n` +
					`body:${JSON.stringify(request.body, null, 2)}`);
				return response.status(400).json("Invalid agents");
			}
		}

		//valida entities
		if (!entities) {
			console.error(`[ERRO VALIDAÇÃO ATIVIDADE] Não foi possível encontrar a lista de entidades:\n` +
				`entities: ${JSON.stringify(request.body.entities, null, 2)}\n` +
				`body:${JSON.stringify(request.body, null, 2)}`);
			return response.status(400).json("Invalid entities");
		}
		else {
			if (entities instanceof Array) {
				const entitesHasProps = entities.map((entity) => {
					if (entity.entity_id && entity.name && entity.role) {
						return true;
					}
					else {
						return false;
					}
				});
				if (entitesHasProps.indexOf(false) != -1) {
					console.error(`[ERRO VALIDAÇÃO ATIVIDADE] As entidades não estão de acordo com as regras:\n` +
						`entities: ${JSON.stringify(request.body.entities, null, 2)}\n` +
						`body:${JSON.stringify(request.body, null, 2)}`);
					return response.status(400).json("Invalid entities attributes, please check the following information: entity_id, name and role.");
				}
			}
			else {
				console.error(`[ERRO VALIDAÇÃO ATIVIDADE] Não foi possível encontrar a lista de entidades:\n` +
					`entities: ${JSON.stringify(request.body.entities, null, 2)}\n` +
					`body:${JSON.stringify(request.body, null, 2)}`);
				return response.status(400).json("Invalid entities");
			}
		}

		if (request.url === '/test') {
			return response.status(202).json({ ok: true });
		}

		//começa transação
		const trx = await knex.transaction();

		try {

			const { session_id } = await trx('Session')
				.where('device_id', device_id)
				.andWhere('game_id', game_id)
				.orderBy([{ column: 'date', order: 'desc' }, { column: 'start_time', order: 'desc' }])
				.select('session_id')
				.first();

			//desculpa
			activity_id = `${activity_id}#${session_id}`;

			const activity_data = {
				session_id,
				activity_id,
				name,
				time,
				properties: JSON.stringify(properties)
			};


			const inserted_activity = await trx('Activity').insert(activity_data);

			if (position_x && position_y) {

				const action_data = {
					activity_id,
					position_x,
					position_y,
					position_z
				};

				const inserted_action = await trx('Action').insert(action_data);

			}

			if (influenced_by) {

				const influenced_by_id = await idGenerator('InfluencedBy', 'influenced_by');
				const influenced_by_data = {
					influenced_by_id,
					influence: influenced_by,
					influenced: activity_id,
					properties: JSON.stringify(influenced_by_properties)
				}
				const inserted_influence = await trx('InfluencedBy').insert(influenced_by_data);

			}

			let registered_agents = await knex('Agent')
				.where('agent_id', 'like', `%#${session_id}`)
				.select('agent_id');

			let registered_entities = await knex('Entity')
				.where('entity_id', 'like', `%#${session_id}`)
				.select('entity_id');

			registered_agents = registered_agents.map((row) => { return row.agent_id });
			registered_entities = registered_entities.map((row) => { return row.entity_id });

			let agents_to_insert = [];
			let game_characteres_to_insert = [];
			let agents_activity = [];

			let entities_to_insert = [];
			let game_objects_to_insert = [];
			let entities_activity = [];

			agents.forEach((value) => {

				let { agent_id, name, type, role, position_x: agent_pos_x, position_y: agent_pos_y, position_z: agent_pos_z, properties: agent_properties } = value;

				agent_id = `${agent_id}#${session_id}`;


				const agent_data_activity = {
					agent_id,
					activity_id,
					role,
					position_x: agent_pos_x,
					position_y: agent_pos_y,
					position_z: agent_pos_z,
					properties: JSON.stringify(agent_properties)
				};

				if (agent_pos_x !== undefined && agent_pos_y !== undefined) {
					const character_data = {
						agent_id,
						position_x: agent_pos_x,
						position_y: agent_pos_y,
						position_z: agent_pos_z
					}
					game_characteres_to_insert.push(character_data);
				}

				const agent_data = {
					agent_id,
					name,
					type,
					properties: JSON.stringify(agent_properties)
				};

				agents_to_insert.push(agent_data);
				agents_activity.push(agent_data_activity);

			});

			entities.forEach((value) => {
				let { entity_id, name, role, position_x: entity_pos_x, position_y: entity_pos_y, position_z: entity_pos_z, properties: entity_properties } = value;

				entity_id = `${entity_id}#${session_id}`;

				const entity_data_activity = {
					entity_id,
					activity_id,
					role,
					position_x: entity_pos_x,
					position_y: entity_pos_y,
					position_z: entity_pos_z,
					properties: JSON.stringify(entity_properties)
				};

				if (entity_pos_x !== undefined && entity_pos_y !== undefined) {
					const object_data = {
						entity_id,
						position_x: entity_pos_x,
						position_y: entity_pos_y,
						position_z: entity_pos_z
					}
					game_objects_to_insert.push(object_data);
				}

				const entity_data = {
					entity_id,
					name,
					properties: JSON.stringify(entity_properties)
				};

				entities_to_insert.push(entity_data);
				entities_activity.push(entity_data_activity);
			});

			// Agents

			if (agents_to_insert.length > 0) {
				const inserted_agents = await trx('Agent')
					.insert(agents_to_insert)
					.onConflict('agent_id')
					.merge(['properties']);
			}
			else {
				const inserted_agents = -1;
			}

			if (game_characteres_to_insert.length > 0) {
				const inserted_game_characters = await trx('GameCharacter')
					.insert(game_characteres_to_insert)
					.onConflict('entity_id')
					.merge();
			}
			else {
				const inserted_game_characters = -1;
			}

			if (agents_activity.length > 0) {
				const inserted_agents_activity = await trx('ActivityAgents').insert(agents_activity);
			}
			else {
				const inserted_agents_activity = -1;
			}

			// Entities

			if (entities_to_insert.length > 0) {
				const inserted_entities = await trx('Entity')
					.insert(entities_to_insert)
					.onConflict('entity_id')
					.merge(['properties']);
			}
			else {
				const inserted_entities = -1;
			}
			if (game_objects_to_insert.length > 0) {
				const inserted_game_objects = await trx('GameObject')
					.insert(game_objects_to_insert)
					.onConflict('entity_id')
					.merge();
			}
			else {
				const inserted_game_objects = -1;
			}


			if (entities_activity.length > 0) {
				const inserted_entities_activity = await trx('ActivityEntities').insert(entities_activity);
			}
			else {
				const inserted_entities_activity = -1;
			}

			await trx.commit();
			return response.status(201).json({ ok: 'true' });

		}
		catch (err) {
			await trx.rollback();
			console.error(`[ERRO INSERÇÃO ATIVIDADE] Nao foi possível cadastrar atividade. ${err.code} - ${err.sqlMessage}`);
			return response.status(400).json({ error: err });
		}

	}

	async getActivityBySession(request, response) {

		const { session } = request.params;

		if (!session) {
			response.status(400).json({ erro: 'invalid session id' })
		}

		// Consulta a tabela Activity
		const activitiesData = await knex('Activity')
			.select('*')
			.where('session_id', session);

		// Consulta a tabela ActivityAgents para incluir os agentes relacionados
		const agentsData = await knex('ActivityAgents')
			.select('*')
			.whereIn('activity_id', activitiesData.map(activity => activity.activity_id));

		// Consulta a tabela ActivityEntities para incluir as entidades relacionadas
		const entitiesData = await knex('ActivityEntities')
			.select('*')
			.whereIn('activity_id', activitiesData.map(activity => activity.activity_id));

		// Consulta a tabela Agent para buscar detalhes dos agentes
		const agentDetails = await knex('Agent')
			.select('agent_id', 'name', 'type')
			.whereIn('agent_id', agentsData.map(agent => agent.agent_id));

		// Consulta a tabela Entity para buscar detalhes das entidades
		const entityDetails = await knex('Entity')
			.select('entity_id', 'name')
			.whereIn('entity_id', entitiesData.map(entity => entity.entity_id));

		// Monta o JSON no formato desejado
		const activities = activitiesData.map(activity => {
			const agents = agentsData
				.filter(agent => agent.activity_id === activity.activity_id)
				.map(agent => {
					// Adiciona detalhes do agente a partir da tabela Agent
					const agentDetail = agentDetails.find(a => a.agent_id === agent.agent_id);
					return {
						agent_id: agent.agent_id,
						name: agentDetail ? agentDetail.name : null,
						type: agentDetail ? agentDetail.type : null,
						position_x: agent.position_x,
						position_y: agent.position_y,
						properties: JSON.parse(agent.properties || '{}'),
						role: agent.role
					};
				});

			const entities = entitiesData
				.filter(entity => entity.activity_id === activity.activity_id)
				.map(entity => {
					// Adiciona detalhes da entidade a partir da tabela Entity
					const entityDetail = entityDetails.find(e => e.entity_id === entity.entity_id);
					return {
						entity_id: entity.entity_id,
						name: entityDetail ? entityDetail.name : null,
						position_x: entity.position_x,
						position_y: entity.position_y,
						properties: JSON.parse(entity.properties || '{}'),
						role: entity.role
					};
				});

			// Define position_x e position_y com base no primeiro entity ou agent
			const positionSource = entities[0] || agents[0];
			const position_x = positionSource ? positionSource.position_x : null;
			const position_y = positionSource ? positionSource.position_y : null;

			return {
				activity_id: activity.activity_id,
				name: activity.name,
				time: activity.time,
				influenced_by: activity.influenced_by || null,
				position_x: position_x,
				position_y: position_y,
				entities: entities,
				agents: agents,
				properties: JSON.parse(activity.properties || '{}')
			};
		});

		return response.status(200).json({ activities });
	}


	async getActivityByGroupSession(request, response) {
		const { session } = request.params;

		if (!session) {
			response.status(400).json({ erro: 'invalid session id' })
		}

		const sessions = await knex('SessionInGroup')
			.select('session_id')
			.where('session_group_id', session);

		const activitiesData = await knex('Activity')
			.select('*')
			.whereIn('session_id', sessions.map(session => session.session_id));

		const agentsData = await knex('ActivityAgents')
			.select('*')
			.whereIn('activity_id', activitiesData.map(activity => activity.activity_id));

		const entitiesData = await knex('ActivityEntities')
			.select('*')
			.whereIn('activity_id', activitiesData.map(activity => activity.activity_id));

		const agentDetails = await knex('Agent')
			.select('agent_id', 'name', 'type')
			.whereIn('agent_id', agentsData.map(agent => agent.agent_id));

		const entityDetails = await knex('Entity')
			.select('entity_id', 'name')
			.whereIn('entity_id', entitiesData.map(entity => entity.entity_id));

		const activities = activitiesData.map(activity => {
			const agents = agentsData
				.filter(agent => agent.activity_id === activity.activity_id)
				.map(agent => {
					// Adiciona detalhes do agente a partir da tabela Agent
					const agentDetail = agentDetails.find(a => a.agent_id === agent.agent_id);
					return {
						agent_id: agent.agent_id,
						name: agentDetail ? agentDetail.name : null,
						type: agentDetail ? agentDetail.type : null,
						position_x: agent.position_x,
						position_y: agent.position_y,
						properties: JSON.parse(agent.properties || '{}'),
						role: agent.role
					};
				});

			const entities = entitiesData
				.filter(entity => entity.activity_id === activity.activity_id)
				.map(entity => {
					const entityDetail = entityDetails.find(e => e.entity_id === entity.entity_id);
					return {
						entity_id: entity.entity_id,
						name: entityDetail ? entityDetail.name : null,
						position_x: entity.position_x,
						position_y: entity.position_y,
						properties: JSON.parse(entity.properties || '{}'),
						role: entity.role
					};
				});

			const positionSource = entities[0] || agents[0];
			const position_x = positionSource ? positionSource.position_x : null;
			const position_y = positionSource ? positionSource.position_y : null;

			return {
				activity_id: activity.activity_id,
				name: activity.name,
				time: activity.time,
				influenced_by: activity.influenced_by || null,
				position_x: position_x,
				position_y: position_y,
				entities: entities,
				agents: agents,
				properties: JSON.parse(activity.properties || '{}')
			};
		});

		return response.status(200).json({ activities });
	}

	async getActivityByGameID(request, response) {

		const { game_id } = request.params;

		if (!game_id) {
			response.status(400).json({ erro: 'invalid game id' })
		}

		const sessionsData = await knex('Session')
			.select('*')
			.where('game_id', game_id);

		// Consulta a tabela Activity
		const activitiesData = await knex('Activity')
			.select('activity_id', 'name')
			.whereIn('session_id', sessionsData.map(session => session.session_id));

		// Consulta a tabela ActivityAgents para incluir os agentes relacionados
		const agentsData = await knex('ActivityAgents')
			.select('*')
			.whereIn('activity_id', activitiesData.map(activity => activity.activity_id));

		// Consulta a tabela ActivityEntities para incluir as entidades relacionadas
		const entitiesData = await knex('ActivityEntities')
			.select('*')
			.whereIn('activity_id', activitiesData.map(activity => activity.activity_id));

		// Consulta a tabela Agent para buscar detalhes dos agentes
		const agentDetails = await knex('Agent')
			.select('name')
			.whereIn('agent_id', agentsData.map(agent => agent.agent_id))
			.groupBy('name');

		// Consulta a tabela Entity para buscar detalhes das entidades
		const entityDetails = await knex('Entity')
			.select('name')
			.whereIn('entity_id', entitiesData.map(entity => entity.entity_id))
			.groupBy('name');

			const activitiesDataGroupByName= await knex('Activity')
			.select('name')
			.whereIn('session_id', sessionsData.map(session => session.session_id))
			.groupBy('name');

		return response.status(200).json({
			activities: activitiesDataGroupByName,
			agents: agentDetails,
			entities: entityDetails,
		});
	}


}

module.exports = ActivityController;

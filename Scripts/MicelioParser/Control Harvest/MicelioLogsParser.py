'''
AUTOR: 			Lucas Sargeiro
DATA: 			01/08/2021
DESCRICAO: 		Script para converter logs de jogos para o modelo utilizado no Micelio

'''
import pyexcel_ods3 as pods
from pprint import pprint
from functools import *
from datetime import datetime
import json

'''
[ ] - Evento 7 muda o ID depois do desenvolvimento
[ ] -
[ ] -
'''

def description(document, file, events, agents, entities, show_a_e = False):
	print('-------------------[Finished]-------------------')
	print()
	print(f'Origem: {document}')
	print(f'Destino: {file}')
	print()
	print(f'Eventos extraidos:\t{len(events)}')
	print(f'Agentes encontrados:\t{len(agents)}')
	print(f'Entidades encontradas:\t{len(entities)}')
	if show_a_e:
		print('Agentes:')
		pprint(agents)
		print('Entidades:')
		pprint(entities)

def splitCoordinates(xy):
	
	xy = str(xy)

	tam_y = len(xy)//2
	tam_x = len(xy) - tam_y

	x = xy[:tam_x:]
	y = xy[tam_y::]

	return x, y

def export_json(obj, file):

    with open(file, 'w', encoding='utf8') as f:
        json.dump(obj, f, indent=4, ensure_ascii=False)


def controlHarvestToMicelioSession(document, sheet, file, show_a_e = False):

	ID_EVENT = 0
	ID_SESSION = 1
	ACTIVITY_NAME = 2
	AGENT_NAME = 3
	TIME = 4
	ATT1 = 5
	ATT2 = 6
	ATT3 = 7
	ID_FUNCTION = 9
	ATT1_NAME = 10
	ATT2_NAME = 11
	ATT3_NAME = 12
	ROLE = 13

	data = pods.get_data(document)
	
	not_empty = lambda x: len(x) > 0
	filtered_data = list(filter(not_empty, data[sheet][1::]))

	day = datetime.now()
	session = {	'session_id': filtered_data[0][ID_SESSION],
				'name': 'exported by script in ' + day.strftime('%d/%m/%Y'),
				'language': 'N/A',
				'game_stage': '1',
				'date': day.strftime('%Y-%m-%d'),
				'session_group_id': None,
				'start_time': day.strftime('%H:%M:%S'),
				'end-time': None}

	# Guarda as Atividades
	activities = []
	# Guarda os agentes para buscar os nomes quando não disponibilizados
	agents = {}
	# Guarda as entidades para buscar os nomes quando não disponibilizados
	entities = {}
	# Guarda os ids de todas as plantar plantadas, pois após o desenvolvimento o ID muda
	planted_plants = {}
	# Guarda as posicoes das plantas desenvolvidas, pois quando colhidas a posição não é conhecida
	evolved_plants = {}

	for evento in filtered_data:
		activity = {}
		
		activity['activity_id'] = evento[ID_EVENT]
		activity['name'] = evento[ACTIVITY_NAME]
		activity['time'] = str(evento[TIME])
		activity['influenced_by'] = None
		activity['influenced_by_properties'] = None

		if str(evento[ID_FUNCTION]) == '2':
			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = []
			
			activity['properties'] = {}
			activity['properties'][ATT1_NAME] = evento[ATT1]
			activity['properties'][ATT2_NAME] = evento[ATT2]
			activity['properties']['planta_sorteada'] = evento[AGENT_NAME]

		elif str(evento[ID_FUNCTION]) == '3':
			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = []

			activity['properties'] = {}
			activity['properties'][ATT1_NAME] = evento[ATT1]
			activity['properties']['tipo_de_praga'] = evento[AGENT_NAME]


		elif str(evento[ID_FUNCTION]) == '7':

			real_plant = evolved_plants[evento[ATT1]]

			activity['position_x'] = real_plant['x']
			activity['position_y'] = real_plant['y']
			activity['entities'] = [{
				'entity_id': real_plant['id'],
				'name': evento[AGENT_NAME],
				'position_x': real_plant['x'],
				'position_y': real_plant['y'],
				'properties': {},
				'role': 'planta'
			}]
			activity['agents'] = []
			
			entities[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '8':

			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = [{
				'agent_id': evento[ATT1],
				'name': evento[AGENT_NAME],
				'type': 'CPU',
				'position_x': None,
				'position_y': None,
				'properties': {},
				'role': 'predador'
			}]
			
			agents[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '9':
			
			activity['position_x'] = evento[ATT2]
			activity['position_y'] = evento[ATT3]
			activity['entities'] = [{
				'entity_id': evento[ATT1],
				'name': evento[AGENT_NAME],
				'position_x': evento[ATT2],
				'position_y': evento[ATT3],
				'properties': {},
				'role': 'planta'
			}]
			activity['agents'] = []

			entities[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

			plant_id = evento[ATT2] + evento[ATT3]
			planted_plants[plant_id] = evento[ATT1]

		elif str(evento[ID_FUNCTION]) == '9.1':
			
			real_id = planted_plants[evento[ATT2] + evento[ATT3]]

			activity['position_x'] = evento[ATT2]
			activity['position_y'] = evento[ATT3]
			activity['entities'] = [{
				'entity_id': real_id,
				'name': evento[AGENT_NAME],
				'position_x': evento[ATT2],
				'position_y': evento[ATT3],
				'properties': {},
				'role': 'planta'
			}]
			activity['agents'] = []

			entities[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

			evolved_plants[evento[ATT1]] = {'id': real_id, 'x': evento[ATT2], 'y': evento[ATT3]}

		elif str(evento[ID_FUNCTION]) == '10':
			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = []
			
			activity['properties'] = {}
			activity['properties']['tipo_predador'] = evento[AGENT_NAME]

		elif str(evento[ID_FUNCTION]) == '11' or str(evento[ID_FUNCTION]) == '12':
			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = []
			
			activity['properties'] = {}
			activity['properties'][ATT1] = evento[ATT1_NAME]
			activity['properties'][ATT2] = evento[ATT2_NAME]
			activity['properties']['tipo_planta'] = evento[AGENT_NAME]

		elif str(evento[ID_FUNCTION]) == '13':
			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = []
			
			activity['properties'] = {}
			activity['properties'][ATT3] = evento[ATT3_NAME]


		elif str(evento[ID_FUNCTION]) == '14':
			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = [{
				'agent_id': evento[ATT1],
				'name': evento[AGENT_NAME],
				'type': 'CPU',
				'position_x': None,
				'position_y': None,
				'properties': {},
				'role': 'inseto'
			}]

			agents[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '15':
			
			x, y = splitCoordinates(evento[ATT3])
			activity['position_x'] = x
			activity['position_y'] = y

			if evento[ATT2] in entities.values():
				activity['entities'] = [{
					'agent_id': evento[ATT2],
					'name': evento[AGENT_NAME],
					'position_x': x,
					'position_y': y,
					'properties': {},
					'role': 'presa'
				}]
				activity['agents'] = []
				entities[evento[ATT2]] = evento[AGENT_NAME]
			else:
				activity['entities'] = []
				activity['agents'] = [{
					'agent_id': evento[ATT2],
					'name': evento[AGENT_NAME],
					'type': 'CPU',
					'position_x': x,
					'position_y': y,
					'properties': {},
					'role': 'presa'
				}]

				agents[evento[ATT2]] = evento[AGENT_NAME]

			nome_agente = agents[evento[ATT1]]

			activity['agents'].append({
					'agent_id': evento[ATT1],
					'name': nome_agente,
					'type': 'CPU',
					'position_x': x,
					'position_y': y,
					'properties': {},
					'role': 'predador'
			})
			
			agents[evento[ATT1]] = nome_agente

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '16':

			x, y = splitCoordinates(evento[ATT3])

			activity['position_x'] = x
			activity['position_y'] = y
			activity['entities'] = []
			activity['agents'] = [{
				'agent_id': evento[ATT1],
				'name': evento[AGENT_NAME],
				'type': 'CPU',
				'position_x': x,
				'position_y': y,
				'properties': {},
				'role': 'inseto_1'
			},
			{
				'agent_id': evento[ATT2],
				'name': evento[AGENT_NAME],
				'type': 'CPU',
				'position_x': x,
				'position_y': y,
				'properties': {},
				'role': 'inseto_2'
			}]
			
			agents[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '17':

			if str(evento[AGENT_NAME]).isnumeric():
				x = evento[ATT2]
				y = evento[ATT3]
				nome_agente_1 = agents[evento[AGENT_NAME]] if evento[AGENT_NAME] in agents else '' 
				id_obj_1 = evento[AGENT_NAME]
				id_obj_2 = evento[ATT1]

				if id_obj_2 in entities:
					activity['name'] += ' (Predação Inseto/Planta)'
					nome_agente_2 = entities[id_obj_2] if id_obj_2 in entities else ''
					activity['entities'] = [{
						'entity_id': id_obj_2,
						'name': nome_agente_2,
						'position_x': x,
						'position_y': y,
						'properties': {},
						'role': 'objeto_2'
					}]
					activity['agents'] = []
					if nome_agente_2 != '':
						entities[id_obj_2] = nome_agente_2
				else:
					activity['name'] += ' (Predação Inseto/Inseto)'		
					nome_agente_2 = agents[id_obj_2] if id_obj_2 in agents else ''
					activity['entities'] = []
					activity['agents'] = [{
						'agent_id': id_obj_2,
						'name': nome_agente_2,
						'type': 'CPU',
						'position_x': x,
						'position_y': y,
						'properties': {},
						'role': 'objeto_2'
					}]
					if nome_agente_2 != '':
						agents[id_obj_2] = nome_agente_2
			else:
				x, y =  splitCoordinates(evento[ATT3])
				nome_agente_1 = evento[AGENT_NAME]
				nome_agente_2 = evento[AGENT_NAME]
				activity['name'] += ' (Reprodução)'
				id_obj_1 = evento[ATT1]
				id_obj_2 = evento[ATT2]
				activity['entities'] = []
				activity['agents'] = [{
					'agent_id': id_obj_2,
					'name': nome_agente_2,
					'type': 'CPU',
					'position_x': x,
					'position_y': y,
					'properties': {},
					'role': 'objeto_2'
				}]

				agents[evento[ATT2]] = nome_agente_1
				

			activity['position_x'] = x
			activity['position_y'] = y
			

			activity['agents'].append({
				'agent_id': id_obj_1,
				'name': nome_agente_1,
				'type': 'CPU',
				'position_x': x,
				'position_y': y,
				'properties': {},
				'role': 'obeto_1'
			})

			activity['properties'] = {}

			if nome_agente_1 != '':
					agents[id_obj_1] = nome_agente_1

		elif str(evento[ID_FUNCTION]) == '18':
			activity['position_x'] = evento[ATT2]
			activity['position_y'] = evento[ATT3]
			activity['entities'] = []
			activity['agents'] = [{
				'agent_id': evento[ATT1],
				'name': evento[AGENT_NAME],
				'type': 'CPU',
				'position_x': evento[ATT2],
				'position_y': evento[ATT3],
				'properties': {},
				'role': 'inseto'
			}]
			
			agents[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

		else:
			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = []

			activity['properties'] = {}

		activities.append(activity)

	session['activities'] = activities

	description(document, file, filtered_data, agents, entities, show_a_e)
	export_json(session, file)


if __name__ == "__main__":
	
	document = input('Base de dados: ')
	file = input('Extrair para: ')
	sheet = "sessao"
	controlHarvestToMicelioSession(document, sheet, file)
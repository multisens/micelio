'''
AUTOR: 			Lucas Sargeiro
DATA: 			01/08/2021
DESCRICAO: 		Script para converter logs de jogos para o modelo utilizado no Micelio
				utilizando a planilha micelio_ch.ods

'''
import pyexcel_ods3 as pods
from pprint import pprint
from functools import *
from datetime import datetime
import json

def description(planilha, file, tot_events, tot_agents, tot_entities):
	print('-------------------[Finished]-------------------')
	print()
	print(f'Origem: {planilha}')
	print(f'Destino: {file}')
	print()
	print(f'Eventos extraidos:\t{tot_events}')
	print(f'Agentes encontrados:\t{tot_agents}')
	print(f'Entidades encontradas:\t{tot_entities}')


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

def controlHarvestToMicelioSession(planilha, file):

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

	data = pods.get_data(planilha)
	
	nao_vazios = lambda x: len(x) > 0
	filtered_data = list(filter(nao_vazios, data['sessao'][1::]))

	day = datetime.now()
	session = {	'session_id': filtered_data[0][ID_SESSION],
				'name': 'exported by script in ' + day.strftime('%d/%m/%Y'),
				'language': 'N/A',
				'game_stage': '1',
				'date': day.strftime('%Y-%m-%d'),
				'session_group_id': None,
				'start_time': day.strftime('%H:%M:%S'),
				'end-time': None}

	activities = []
	agents = {}
	entities = {}
	count = 1

	for evento in filtered_data:
		activity = {}
		
		activity['activity_id'] = count
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
			activity['position_x'] = None
			activity['position_y'] = None
			activity['entities'] = []
			activity['agents'] = [{
				'entity_id': evento[ATT1],
				'name': evento[AGENT_NAME],
				'position_x': None,
				'position_x': None,
				'properties': {},
				'role': 'planta'
			}]
			
			agents[evento[ATT1]] = evento[AGENT_NAME]

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
				'position_x': None,
				'properties': {},
				'role': 'predador'
			}]
			
			agents[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '9' or str(evento[ID_FUNCTION]) == '9.1':
			activity['position_x'] = evento[ATT2]
			activity['position_y'] = evento[ATT3]
			activity['entities'] = [{
				'entity_id': evento[ATT1],
				'name': evento[AGENT_NAME],
				'position_x': evento[ATT2],
				'position_x': evento[ATT3],
				'properties': {},
				'role': 'planta'
			}]
			activity['agents'] = []
			
			entities[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

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
				'position_x': None,
				'properties': {},
				'role': 'inseto'
			}]

			agents[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '15':
			
			x, y = splitCoordinates(evento[ATT3])

			nome_agente_2 = agents[evento[ATT1]] if evento[ATT1] in agents else '' 

			activity['position_x'] = x
			activity['position_y'] = y
			activity['entities'] = []
			activity['agents'] = [{
				'agent_id': evento[ATT1],
				'name': '',
				'type': 'CPU',
				'position_x': x,
				'position_x': y,
				'properties': {},
				'role': 'predador'
			},
			{
				'agent_id': evento[ATT2],
				'name': evento[AGENT_NAME],
				'type': 'CPU',
				'position_x': x,
				'position_x': y,
				'properties': {},
				'role': 'presa'
			}]
			
			if nome_agente_2 != '':
				agents[evento[ATT1]] = nome_agente_2
			agents[evento[ATT2]] = evento[AGENT_NAME]

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
				'position_x': y,
				'properties': {},
				'role': 'inseto_1'
			},
			{
				'agent_id': evento[ATT2],
				'name': evento[AGENT_NAME],
				'type': 'CPU',
				'position_x': x,
				'position_x': y,
				'properties': {},
				'role': 'inseto_2'
			}]
			
			agents[evento[ATT1]] = evento[AGENT_NAME]

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '17':
			activity['position_x'] = evento[ATT2]
			activity['position_y'] = evento[ATT3]
			activity['entities'] = []

			nome_agente_1 = agents[evento[AGENT_NAME]] if evento[AGENT_NAME] in agents else '' 
			nome_agente_2 = agents[evento[ATT1]] if evento[ATT1] in agents else '' 

			activity['agents'] = [{
				'agent_id': evento[AGENT_NAME],
				'name': nome_agente_1,
				'type': 'CPU',
				'position_x': evento[ATT2],
				'position_x': evento[ATT3],
				'properties': {},
				'role': 'obeto_1'
			},
			{
				'agent_id': evento[ATT1],
				'name': nome_agente_2,
				'type': 'CPU',
				'position_x': evento[ATT2],
				'position_x': evento[ATT3],
				'properties': {},
				'role': 'objeto_2'
			}]
			
			if nome_agente_1 != '':
				agents[evento[AGENT_NAME]] = nome_agente_1
			
			if nome_agente_2 != '':
				agents[evento[ATT1]] = nome_agente_2

			activity['properties'] = {}

		elif str(evento[ID_FUNCTION]) == '18':
			activity['position_x'] = evento[ATT2]
			activity['position_y'] = evento[ATT3]
			activity['entities'] = []
			activity['agents'] = [{
				'agent_id': evento[ATT1],
				'name': evento[AGENT_NAME],
				'type': 'CPU',
				'position_x': evento[ATT2],
				'position_x': evento[ATT3],
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
		count += 1

	session['activity'] = activities

	description(planilha, file, len(filtered_data), len(agents), len(entities))
	export_json(session, file)



if __name__ == "__main__":
	
	planilha = input('Base de dados: ')
	file = input('Extrair para: ')

	controlHarvestToMicelioSession(planilha, file)
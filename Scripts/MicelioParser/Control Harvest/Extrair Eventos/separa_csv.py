'''
AUTOR: 			Lucas Sargeiro
DATA: 			09/08/2021
DESCRICAO: 		Extrai multiplas sessoes de 1 CSV colocando cada uma em um arquivo

'''
import pyexcel_ods3 as pods
from functools import *
import threading

tot = 0

class CreateDocumentThread(threading.Thread):
	def __init__(self, labels, documents_to_create):
		threading.Thread.__init__(self)
		self.labels = labels
		self.documents_to_create = documents_to_create

	def run(self):
		global tot
		document = {}
		document['sessao'] = [self.labels] + self.documents_to_create['events']
		
		# TODO: incluir lista de formulas abaixo apos os dados do evento
		#
		# ['=VLOOKUP(C2;$legenda.$A$2:$K$20;3;0)&"("&K2&" "&L2&" "&M2&")"',
		# '=VLOOKUP($C2;$legenda.$A$2:$K$20;2;0)',
		# '=IF(VLOOKUP($C2;$legenda.$A$2:$K$20;9;0)<>"vazio";VLOOKUP($C2;$legenda.$A$2:$K$20;9;0);"")',
		# '=IF(VLOOKUP($C2;$legenda.$A$2:$K$20;10;0)<>"vazio";VLOOKUP($C2;$legenda.$A$2:$K$20;10;0);"")',
		# '=IF(VLOOKUP($C2;$legenda.$A$2:$K$20;11;0)<>"vazio";VLOOKUP($C2;$legenda.$A$2:$K$20;11;0);"")',
		# '=IF(VLOOKUP($C2;$legenda.$A$2:$K$20;7;0)<>"vazio";VLOOKUP($C2;$legenda.$A$2:$K$20;7;0);"")']

		pods.save_data(f'./Eventos/{self.documents_to_create["document_name"]}', document)
		tot += 1
		print(f'Almost {tot} has already done.')	

def generate_documents_to_create(data):
	SESSION_ID_INDEX = 1
	documents_to_create = {}
	
	for event in data:
		document_name = f'sessao_{event[SESSION_ID_INDEX]}.ods'

		if event[SESSION_ID_INDEX] in documents_to_create:
			documents_to_create[event[SESSION_ID_INDEX]]['events'].append(event)
		else:
			documents_to_create[event[SESSION_ID_INDEX]] = {
				'document_name': document_name,
				'events':[
					event
				]
			}

	return documents_to_create

def control_harvest_csv_extract(file, sheet):	
	data = pods.get_data(file)

	not_empty = lambda x: len(x) > 0
	filtered_data = list(filter(not_empty, data[sheet][1::]))
	labels = data[sheet][0]

	documents = generate_documents_to_create(filtered_data)

	for doc in documents.keys():
		create = CreateDocumentThread(labels, documents[doc])
		create.start()

control_harvest_csv_extract('events.ods', 'events')
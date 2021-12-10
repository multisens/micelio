from datetime import datetime
from provenance.helpers.IDGenerator import IDGenerator

class Session:

	def __init__(self, name, language = 'N/A', game_stage = '1', session_group = None, session_id = None):
		
		now = datetime.now()

		self.session_id = IDGenerator.generate_id(base_name = 'SS-') if session_id is None else session_id

		self.name = name
		self.language = language
		self.session_group = session_group
		self.game_stage = game_stage
		self.date = now.strftime('%Y-%m-%d')
		self.start_time = now.strftime('%H:%M:%S')
		self.end_time = None


	def __str__(self):
		result =  f'# Session\n'
		result += f'  - Nome: {self.name}\n'
		result += f'  - Idioma: {self.language}\n'
		if self.session_group:
			result += f'  - Grupo: {self.session_group}\n'
		result += f'  - Data: {self.date}\n'
		result += f'      Inicio:\t{self.start_time}\n'
		if self.end_time:
			result += f'      Fim:\t{self.end_time}\n'
		else:
			result += f'      Fim:\tnão finalizada\n'
		return result

	def close_session(self):
		now = datetime.now()
		self.end_time = now.strftime('%H:%M:%S')
		return {'end_time': self.end_time}


	def from_json(obj):
		return Session(obj['name'], 
					   obj['language'],
					   obj['game_stage'],
					   obj['session_group'],
					   obj['session_id'])
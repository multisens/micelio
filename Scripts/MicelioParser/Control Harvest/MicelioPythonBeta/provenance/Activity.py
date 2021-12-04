from provenance.helpers.IDGenerator import IDGenerator

class Activity:

	def __init__(self, name, time, position_x = None, position_y = None, position_z = None, influenced_by = None, properties = {}, activity_id = None, agents = [], entities = []):
		

		self.activity_id = IDGenerator.generate_id(base_name='AC-') if activity_id is None else activity_id
		self.name = name
		self.time = time
		self.position_x = position_x
		self.position_y = position_y
		self.position_z = position_z
		self.influenced_by = influenced_by
		self.properties = properties
		self.agents = agents
		self.entities = entities


	def __str__(self):
		result =  f'# Activity\n'
		result +=  f'  - ID: {self.activity_id}\n'
		result += f'  - Nome: {self.name}\n'
		result += f'  - Momento: {self.time}\n'
		if self.position_x  != None and self.position_y != None:
			result += f'  - Posição(x, y, z): {self.position_x} x; {self.position_y} y; {self.position_z} z\n'
		if self.influenced_by != None:
			result += f'  - Influenciada por: {self.influenced_by}\n'
		if self.properties:
			result += f'  - Propriedades:\n'
			for p in self.properties.items():
				result += f'      {p[0]}: {p[1]}\n'
		result +='  - Agentes: \n'
		if len(self.agents) == 0:
			result += f'    Não possui agentes.\n'
		else:
			for a in self.agents:
				result += f'    {a}\n'
		result +='  - Entidades: \n'
		if len(self.entities) == 0:
			result += f'    Não possui entidades.\n'
		else:
			for e in self.entities:
				result += f'    {e}\n'
		return result

	def add_agent(self, agent, role = None):
		if role is None:
			if not agent.has_role():
				raise AttributeError('Agents must have a settled role to be in a activity.')
		else:
			agent.add_role(role)
		self.agents.append(agent)

	def add_entity(self, entity, role = None):
		if role is None:
			if not entity.has_role():
				raise AttributeError('Entities must have a settled role to be in a activity.')
		else:
			entity.add_role(role)
		self.entities.append(entity)

	def add_propertie(self, key, value):
		self.properties[key] = value

	def from_json(obj):
		return Activity(obj['name'], 
						obj['time'],
						obj['position_x'],
						obj['position_y'],
						obj['influenced_by'],
						obj['properties'],
						obj['activity_id'],
						obj['agents'],
						obj['entities'])
from provenance.helpers.IDGenerator import IDGenerator

class Agent:

	def __init__(self, name, type_agent, position_x = None, position_y = None, properties = {}, role = None, agent_id = None):
		self.agent_id = IDGenerator.generate_id(base_name='AG-') if agent_id is None else agent_id
		self.name = name
		self.role = role
		self.type = type_agent
		self.position_x = position_x
		self.position_y = position_y
		self.properties = properties

	def __str__(self):
		result =  f'# Agent\n'
		result += f'      - ID: {self.agent_id}\n'
		result += f'      - Nome: {self.name}\n'
		result += f'      - Tipo: {self.type}\n'
		if self.has_role():
			result += f'      - Papel: {self.role}\n'
		if self.position_x  != None and self.position_y != None:
			result += f'      - Posição(x, y): {self.position_x} x; {self.position_y} y\n'
		if self.properties:
			result += f'      - Propriedades:\n'
			for p in self.properties.items():
				result += f'          {p[0]}: {p[1]}\n'
		return result

	def add_propertie(self, key, value):
		self.properties[key] = value

	def add_role(self, role):
		self.role = role

	def has_role(self):
		role = self.role
		if role is None:
			return False
		if role == '':
			return False
		if role.strip() == '':
			return False
		return True

	def from_json(obj):
		return Agent(obj['name'], 
					 obj['type_agent'],
					 obj['position_x'],
					 obj['position_y'],
					 obj['properties'],
					 obj['role'],
					 obj['agent_id'])
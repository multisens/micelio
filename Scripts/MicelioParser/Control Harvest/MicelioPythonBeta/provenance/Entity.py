from provenance.helpers.IDGenerator import IDGenerator

class Entity:

	def __init__(self, name, position_x = None, position_y = None, properties = {}, role = None, entity_id = None):
		self.entity_id = IDGenerator.generate_id(base_name='ET-') if entity_id is None else entity_id
		self.name = name
		self.role = role
		self.position_x = position_x
		self.position_y = position_y
		self.properties = properties

	def __str__(self):
		result =  f'# Entity\n'
		result += f'      - ID: {self.entity_id}\n'
		result += f'      - Nome: {self.name}\n'
		if self.has_role():
			result += f'      - Papel: {self.role}\n'
		if self.position_x  != None and self.position_y != None:
			result += f'      - Posição(x, y): {self.position_x} x; {self.position_y} y\n'
		if self.properties:
			result += f'      - Propriedades:\n'
			for p in self.properties.items():
				result += f'          {p[0]}: {p[1]}\n'
		return result

	def __generate_entity_id(self, hash_seed, base_name = 'ET-'):
		hl = hashlib.md5()
		hl.update(hash_seed.encode('utf-8'))
		return base_name + hl.hexdigest()

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
		return Entity(obj['name'], 
					  obj['position_x'],
					  obj['position_y'],
					  obj['properties'],
					  obj['role'],
					  obj['entity_id'])
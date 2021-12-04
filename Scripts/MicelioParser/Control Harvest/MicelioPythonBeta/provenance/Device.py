import os
import platform
from provenance.helpers.IDGenerator import IDGenerator

class Device:
	
	def __init__(self, device_id = None, system_name = None, model = None, width = None, height = None):

		device_id = IDGenerator.generate_id(base_name='MicelioCLI-') if device_id is None else device_id
		model = 'micelioCLI' if model is None else model
		system_name = platform.system() if system_name is None else system_name
		width = os.get_terminal_size()[0] if width is None else width
		height = os.get_terminal_size()[1] if height is None else height

		self.device_id = device_id
		self.model = model
		self.system_name = system_name
		self.screen_width = width
		self.screen_height = height
		

	def __str__ (self):
		result =  f'# Device\n'
		result += f'  - ID: {self.device_id}\n'
		result += f'  - Sistema: {self.system_name}\n'
		result += f'  - Modelo:{self.model}\n'
		result += f'  - Tela(w, h): {self.screen_width} w; {self.screen_height} h\n'
		return result

	def from_json(obj):
		return Device(obj['device_id'], 
					  obj['model'],
					  obj['system_name'],
					  obj['screen_width'],
					  obj['screen_height'])
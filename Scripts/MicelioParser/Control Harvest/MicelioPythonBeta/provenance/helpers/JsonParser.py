import json

class JsonParser:

	@staticmethod
	def import_json(file = 'file_export.json'):
		with open(file, 'r', encoding='utf8') as f:
			return json.load(f)
	
	@staticmethod
	def export_json(obj, file = 'file_export.json'):
		with open(file, 'w', encoding='utf8') as f:
			json.dump(obj, f, indent=4, ensure_ascii=False, default=lambda o: o.__dict__)

	@staticmethod
	def can_load(file):
		try:
			with open(file, 'r', encoding='utf8') as f:
				json.load(f)
				return True
		except Exception:
			return False
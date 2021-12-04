import hashlib
from datetime import datetime

class IDGenerator:

	@staticmethod
	def generate_id(hash_seed = None, base_name = ''):

		hash_seed = datetime.now().strftime('%Y%m%d%H%M%S%s') if hash_seed is None else hash_seed
		hl = hashlib.md5()
		hl.update(hash_seed.encode('utf-8'))
		return base_name + hl.hexdigest()
import requests
from provenance.Device import Device

class Micelio:

	def __init__(self, device, token, default_url = 'https://achernar.eic.cefet-rj.br/micelio/api', is_test = False):
		self.default_url = default_url	
		self.is_test = is_test
		self.token = token
		self.device = device
		self.send_device(self.device)

	def send_device(self, device):
		return self.__send_api_request('/device', 'POST', device)

	def send_activity(self, activity):
		return self.__send_api_request('/activity', 'POST', activity)

	def start_session(self, session):
		return self.__send_api_request('/session', 'POST', session)

	def close_session(self, session):
		return self.__send_api_request('/session', 'PUT', session.close_session())

	def __send_api_request(self, endpoint, method, obj):
		
		if self.is_test:
			url = self.default_url + endpoint + '/test'
		else:
			url = self.default_url + endpoint
		headers = {'device_id': self.device.device_id, 'token': self.token}

		try:
			if method == 'POST':
				r = requests.post(url, headers = headers, json = obj.__dict__)
			elif method == 'PUT':
				r = requests.put(url, headers = headers, json = obj)

			# pprint(r.__dict__)
			# pprint(r.request.__dict__)

			return r.status_code

		except Exception as e:
			print('Error! Cannot send data to server.', e)

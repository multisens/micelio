import os
import sys
import math
from provenance.helpers.JsonParser import JsonParser
from provenance.Device import Device
from provenance.Micelio import Micelio
from provenance.Session import Session
from provenance.Activity import Activity

dir = './Files/'

if len(sys.argv) > 1:
	game_token = sys.argv[1]
else:
    game_token = input("Token do Jogo: ")


device = Device(system_name="Micelio Python Beta", model="CLI")
micelio = Micelio(device, game_token)


def get_file_to_import(dir):
	files_to_import = os.listdir(dir)
	json = JsonParser()
	result = []
	sucess = []
	errors = []

	for file in files_to_import:

		file_dir = os.path.join(dir, file)

		if json.can_load(file_dir):
			result.append(json.import_json(file_dir))
			sucess.append(file_dir)
		else:
			errors.append(file_dir)

	return result, sucess, errors

def print_progress(actual, total, message = ''):

	new_actual = (actual/total) * 100
	new_actual_floor = math.floor(new_actual) 
	new_total = 100 - new_actual_floor

	for i in range(new_actual_floor):
		print('#', end='')
	for i in range(new_total):
		print('-', end='')
	
	print(f'\t{((actual/total)*100):.2f}%\t{message}')

if __name__ == "__main__":

	files_to_import, sucess, errors = get_file_to_import(dir)
	total = len(files_to_import)

	for index, file in enumerate(files_to_import):
		
		print_progress(index + 1, total, f'importing {sucess[index]}')
		
		session = Session(
			file['name'],
			file['language'],
			file['game_stage'],
			file['session_group_id']
			)
		
		micelio.start_session(session)

		for activity_data in file['activities']:
			activity = Activity(
				activity_data['name'],
				activity_data['time'],
				activity_data['position_x'],
				activity_data['position_y'],
				0,
				activity_data['influenced_by'],
				activity_data['properties'],
				activity_data['activity_id'],
				activity_data['agents'],
				activity_data['entities'],
			)
			micelio.send_activity(activity)

		micelio.close_session(session)

	print(f'Insert {total} files into database.')
	
	for e in errors:
		print(f'Couldn\'t load file {e}.')
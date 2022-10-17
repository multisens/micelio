import json

init_json = '''
{
  "session_id": 1010,
  "name": "path test",
  "language": "Pt-Br",
  "game_stage": "1",
  "date": "2021-08-09",
  "session_group_id": null,
  "start_time": "02:02:46",
  "end-time": null,
  "activities": [
'''
activityA = '''
    {
        "activity_id": 0,
        "name": "plantar",
        "time": "1",
        "influenced_by": null,
        "position_x": 0,
        "position_y": 0,
        "entities": [],
        "agents": [],
        "properties": {}
    },
'''

final_json = '''
  ]
}
'''
y = 5
x = 5

for i in range(1,51):

  if i < 10 :
    x += 10
  if i > 40 :
    x += 10
    y += 10
  elif i > 30 :
    y -= 10
  elif i > 20 :
    x -= 10
  elif i > 10 :
    y += 10

  activityA += '\t\t{\n'
  activityA += '\t\t\t"activity_id": {},\n'.format(i)
  activityA += '\t\t\t"name": "plantar",\n'
  activityA += '\t\t\t"time": "{}",\n'.format(i*5)
  activityA += '\t\t\t"influenced_by": null,\n'

  activityA += '\t\t\t"position_x": {},\n'.format(x)
  activityA += '\t\t\t"position_y": {},\n'.format(y)

  activityA += '\t\t\t"entities": [],\n'
  activityA += '\t\t\t"agents": [],\n'
  activityA += '\t\t\t"properties": {}\n'
  activityA += '\t\t},\n'

final = init_json+activityA+final_json

out_file = open("test.json", "w") 
    
out_file.write(final)
    
out_file.close() 
import os
import utils
from flask import Flask, jsonify, abort
from flask_cors import CORS

DIR_DATA = os.getenv('DIR_DATA')
PORT_SERVER = os.getenv('PORT_SERVER')

ACCEPTED_CHARS = ['F', 'R', 'L']

app = Flask(__name__)
CORS(app)

# const steps = [
#   {char: 'L', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 270},
# ]

def bad_request(message):
  response = jsonify({'message': message})
  response.status_code = 400
  return response

def process_char_data(char_list):

  ROTATE_TRANSLATE_MAP = {
    '0': [0, -1],
    '90': [1, 0],
    '180': [0, 1],
    '270': [-1, 0],
  }

  CHAR_ACTION = {
    'F': {
      'translate': 1,
    },
    'R': {
      'rotate': 90
    },
    'L': {
      'rotate': -90
    }
  }

  processed = {
    'steps': [0] * (len(char_list) + 1),
    'nodes': [], 
    'paths': [],
    'dupNodes': [],
    'dupPaths': [],
    'endPosition': [],
    'endRotation': None
  }

  processed['steps'][0] = {
    'char': 'n/a',
    'position': [0, 0],
    'rotation': 0,
    'dupNode': False,
    'dupPath': False
  }

  i = 1
  for char in char_list:
    processed['steps'][i] = processed['steps'][i-1].copy()
    processed['steps'][i]['char'] = char
    processed['steps'][i]['dupNode'] = False
    processed['steps'][i]['dupPath'] = False

    action = CHAR_ACTION[char]
    if ('translate' in action):
      processed['steps'][i]['position'] = utils.listAdd(
          processed['steps'][i]['position'], 
          ROTATE_TRANSLATE_MAP[str(processed['steps'][i-1]['rotation'])]
        )
    if ('rotate' in action):
      processed['steps'][i]['rotation'] = processed['steps'][i-1]['rotation'] + action['rotate']
      if (processed['steps'][i]['rotation'] == -90):
        processed['steps'][i]['rotation'] = 270
      elif (processed['steps'][i]['rotation'] == 360):
        processed['steps'][i]['rotation'] = 0
    i = i + 1
  
  i = 0
  for step in processed['steps']:
    processed['steps'][i]['position'] = {
      'x': step['position'][0],
      'y': step['position'][1]
    }
    i = i + 1

  return processed

@app.route('/api/status', methods=['GET'])
def status():
  return 'api:healthy'

@app.route('/api/files/analyze', methods=['GET'])
def getFiles():

  files = utils.getFile(DIR_DATA, ['txt'])

  # validation
  # ----------
  # no .txt files
  num_files = len(files)
  if (num_files == 0):
    return bad_request('no .txt files in ' + DIR_DATA)

  # more than one .txt file
  if (num_files > 1):
    return bad_request('only one .txt file should be in ' + DIR_DATA)

  file = files[0]
  file_data = utils.parseFile(files[0]['path'], ACCEPTED_CHARS)

  # bad character in file
  if ('error' in file_data):
    return bad_request(file_data['error'])

  # process data
  # ------------
  file_data_processed = process_char_data(file_data)

  # response
  # --------
  response = jsonify({
    'fileName': file['name'],
    'fileData': file_data_processed
  })
  return(response)



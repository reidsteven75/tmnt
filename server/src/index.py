import os
import utils
import processor
from flask import Flask, jsonify, request
from flask_cors import CORS

DIR_DATA = os.getenv('DIR_DATA')
PORT_SERVER = os.getenv('PORT_SERVER')
ACCEPTED_CHARS = ['F', 'R', 'L']
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

app = Flask(__name__)
CORS(app)

def bad_request(message):
  response = jsonify({'message': message})
  response.status_code = 400
  return response

@app.route('/api/status', methods=['GET'])
def status():
  return 'api:healthy'

@app.route('/api/files/analyze', methods=['GET'])
def getFiles():
  files = utils.getFile(DIR_DATA, ['txt'])
  
  # validation
  # ----------

  # query params
  initRotation = request.args.get('initRotation')
  if (initRotation is None):
    return bad_request('missing required query param \'initRotation\'')

  if initRotation not in ROTATE_TRANSLATE_MAP:
    return bad_request('invalid query param \'initRotation\', it must be one of ' +
                      str(list(ROTATE_TRANSLATE_MAP)) + 
                      '. You can change this in \'web-app/config.js\'')

  # no .txt files
  num_files = len(files)
  if (num_files == 0):
    return bad_request('no .txt files in ' + DIR_DATA)

  # no more than one .txt file
  if (num_files > 1):
    return bad_request('only one .txt file should be in ' + DIR_DATA)
  file = files[0]
  file_data = utils.parseFile(files[0]['path'], ACCEPTED_CHARS)

  # bad character in file
  if ('error' in file_data):
    return bad_request(file_data['error'])

  # process data
  # ------------
  file_data_processed = processor.processCharData(file_data, initRotation, ROTATE_TRANSLATE_MAP, CHAR_ACTION)

  # response
  # --------
  response = jsonify({
    'fileName': file['name'],
    'fileData': file_data_processed
  })
  return(response)



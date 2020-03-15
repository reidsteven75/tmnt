import os
import utils
import processor
from flask import Flask, jsonify, abort
from flask_cors import CORS

DIR_DATA = os.getenv('DIR_DATA')
PORT_SERVER = os.getenv('PORT_SERVER')

ACCEPTED_CHARS = ['F', 'R', 'L']

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
  file_data_processed = processor.process_char_data(file_data)

  # response
  # --------
  response = jsonify({
    'fileName': file['name'],
    'fileData': file_data_processed
  })
  return(response)



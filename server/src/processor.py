import os
import utils
import functions

def processCharData(char_list, initRotation, ROTATE_TRANSLATE_MAP, CHAR_ACTION):

  max_coordinates = {
    '-x': 0,
    '+x': 0,
    '-y': 0,
    '+y': 0
  }

  cache = {
    'nodes': [[0, 0]], 
    'paths': [],
    'dupNodes': [],
    'dupPaths': []
  }

  processed = {
    'steps': [0] * (len(char_list) + 1),
    'nodes': [{
      'i': 0,
      'position': [0, 0]
    }], 
    'paths': [],
    'dupNodes': [],
    'dupPaths': [],
    'endState': {
      'x': None,
      'y': None,
      'rotation': None
    },
    'gridDimensions': {}
  }

  functions.populateOrigin(processed, initRotation)

  i = 0
  for char in char_list:
    i = i + 1
    functions.populateStep(processed['steps'], i, char)
    action = CHAR_ACTION[char]
    
    if ('translate' in action):
      functions.parseTranslate(processed, i, cache, max_coordinates, ROTATE_TRANSLATE_MAP)

    if ('rotate' in action):
      functions.parseRotate(processed, i, action)

  functions.parseGrid(processed, max_coordinates)
  functions.parseEndState(processed, i)
  functions.formatReturn(processed)
  
  cache = {}
  return processed
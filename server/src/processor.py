import os
import utils
import functions

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

def processCharData(char_list):

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

  functions.populateOrigin(processed)

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
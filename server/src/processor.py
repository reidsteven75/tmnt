import os
import utils

# const steps = [
#   {char: 'L', dupNode: false, dupPath: false, position: { x:0, y:0 }, rotation: 270},
# ]

# class Step:
#   def __init__(self, name):
#     self.name = name

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

  processed['steps'][0] = {
    'char': 'n/a',
    'position': [0, 0],
    'rotation': 0,
    'dupNode': False,
    'dupPath': False
  }

  i = 0
  for char in char_list:
    i = i + 1
    processed['steps'][i] = processed['steps'][i-1].copy()
    processed['steps'][i]['char'] = char
    processed['steps'][i]['dupNode'] = False
    processed['steps'][i]['dupPath'] = False

    action = CHAR_ACTION[char]
    
    # apply translation to previous step state
    if ('translate' in action):
      processed['steps'][i]['position'] = utils.listAdd(
          processed['steps'][i]['position'], 
          ROTATE_TRANSLATE_MAP[str(processed['steps'][i-1]['rotation'])]
        )
      # determine unique paths travelled to, and paths travelled to more than once (duplicate)
      path = [processed['steps'][i-1]['position'], processed['steps'][i]['position']]
      path_reversed = [path[1],path[0]]

      if (path in cache['paths'] or path_reversed in cache['paths']):
        processed['steps'][i]['dupPath'] = True
        if (path not in cache['dupPaths']):
          cache['dupPaths'].append(path)
          processed['dupPaths'].append({
            'i': i,
            'path': path
          })
      else:
        if (processed['steps'][i]['position'] not in cache['paths']):
          cache['paths'].append(path)
          processed['paths'].append({
            'i': i,
            'path': path
          })
    
      # determine unique nodes travelled to, and nodes travelled to more than once (duplicate)
      position = processed['steps'][i]['position']
      if (position in cache['nodes']):
        processed['steps'][i]['dupNode'] = True
        if (position not in cache['dupNodes']):
          cache['dupNodes'].append(position)
          processed['dupNodes'].append({
            'i': i,
            'position': position
          })
      else:
        if (position not in cache['nodes']):
          cache['nodes'].append(position)
          processed['nodes'].append({
            'i': i,
            'position': position
          })

      # calculate max cooridinates
      if (position[0] < max_coordinates['-x']):
        max_coordinates['-x'] = position[0]
      if (position[0] > max_coordinates['+x']):
        max_coordinates['+x'] = position[0]
      if (position[1] < max_coordinates['-y']):
        max_coordinates['-y'] = position[1]
      if (position[1] > max_coordinates['+y']):
        max_coordinates['+y'] = position[1]

    # apply rotation to previous step state
    if ('rotate' in action):
      processed['steps'][i]['rotation'] = processed['steps'][i-1]['rotation'] + action['rotate']
      if (processed['steps'][i]['rotation'] == -90):
        processed['steps'][i]['rotation'] = 270
      elif (processed['steps'][i]['rotation'] == 360):
        processed['steps'][i]['rotation'] = 0

  # determine recommended grid size
  processed['gridDimension'] = max(
    abs(max_coordinates['-x']),
    abs(max_coordinates['+x']),
    abs(max_coordinates['-y']),
    abs(max_coordinates['+y'])
  )

  processed['gridCoordinates'] = max_coordinates

  # determine last position
  processed['endState'] = {
    'x': processed['steps'][i]['position'][0],
    'y': processed['steps'][i]['position'][1],
    'rotation': processed['steps'][i]['rotation']
  }

  # format response so it can be digested by frontend without additional parsing
  i = -1
  for step in processed['steps']:
    i = i + 1
    processed['steps'][i]['position'] = {
      'x': step['position'][0],
      'y': step['position'][1]
    }
    
  return processed
import os
import utils

# -------------------------------------------------------
def populateOrigin(processed, initRotation):
  processed['steps'][0] = {
    'char': 'n/a',
    'position': [0, 0],
    'rotation': int(initRotation),
    'dupNode': False,
    'dupPath': False
  }

# -------------------------------------------------------
def populateStep(steps, i, char):
  steps[i] = steps[i-1].copy()
  steps[i]['char'] = char
  steps[i]['dupNode'] = False
  steps[i]['dupPath'] = False

# -------------------------------------------------------
def formatReturn(processed):
  i = -1
  for step in processed['steps']:
    i = i + 1
    processed['steps'][i]['position'] = {
      'x': step['position'][0],
      'y': step['position'][1]
    }

# -------------------------------------------------------
def parseEndState(processed, i):
  processed['endState'] = {
    'x': processed['steps'][i]['position'][0],
    'y': processed['steps'][i]['position'][1],
    'rotation': processed['steps'][i]['rotation']
  }

# -------------------------------------------------------
def parseGrid(processed, max_coordinates):
  processed['gridDimension'] = max(
    abs(max_coordinates['-x']),
    abs(max_coordinates['+x']),
    abs(max_coordinates['-y']),
    abs(max_coordinates['+y'])
  )
  processed['gridCoordinates'] = max_coordinates

# -------------------------------------------------------
def parseRotate(processed, i, action):
  processed['steps'][i]['rotation'] = processed['steps'][i-1]['rotation'] + action['rotate']
  if (processed['steps'][i]['rotation'] == -90):
    processed['steps'][i]['rotation'] = 270
  elif (processed['steps'][i]['rotation'] == 360):
    processed['steps'][i]['rotation'] = 0

# -------------------------------------------------------
def parseTranslate(processed, i, cache, max_coordinates, ROTATE_TRANSLATE_MAP):
  processed['steps'][i]['position'] = utils.listAdd(
    processed['steps'][i]['position'], 
    ROTATE_TRANSLATE_MAP[str(processed['steps'][i-1]['rotation'])]
  )
  # determine unique paths travelled to, and paths travelled to more than once (duplicate)
  path = [processed['steps'][i-1]['position'], processed['steps'][i]['position']]
  path_reversed = [path[1],path[0]]

  if (path in cache['paths'] or path_reversed in cache['paths']):
    # processed['steps'][i]['dupPath'] = True
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
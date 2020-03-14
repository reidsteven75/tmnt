import os
import json
import numpy as np

def listAdd(A, B):
  a = np.matrix(A)
  b = np.matrix(B)
  c = a + b
  return c.tolist()[0]

def getFile(dir, extensions):
  files = []
  for file in os.listdir(dir):
    if file.endswith(tuple(extensions)):
      files.append({
        'path': dir + '/' + file,
        'name': file
      })
  return(files)

def parseFile(file, accepted_chars):
  file_data = []
  file = open(file, 'r')
  while 1: 
    char = file.read(1)           
    if not char:  
      break
    if char in accepted_chars:
      file_data.append(char)
    else:
      file_data = {
        'error': 'bad character in file \'' + char + '\''
      } 
      break
  file.close()
  return file_data
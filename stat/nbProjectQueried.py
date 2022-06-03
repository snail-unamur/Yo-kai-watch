import requests
import json
import os, os.path
import time

folderPath = 'D:\\Github\\Yo-Kai-Watch\\stat\\letters\\'
listFiles = os.listdir(folderPath)

tot = 0
for f in listFiles:
    print(f)
    fileName = folderPath + f
    file = open(fileName)
    data = json.load(file)

    nbComponents = len(data[list(data.keys())[0]])
    print(nbComponents)
    tot += nbComponents

print(tot)

# with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
#     json.dump(obj, outfile)
import requests
import json
import os, os.path
import time

folderPath = 'D:\\Github\\Yo-Kai-Watch\\stat\\passed\\'
listFiles = os.listdir(folderPath)

def clean(f):
    obj = {
        "subnames":{}
    }
    print(f)
    fileName = folderPath + f
    file = open(fileName)
    data = json.load(file)

    c = chr(int(f.split(".")[0]))
    obj["subnames"][c] = data["subnames"][c]

    with open(fileName + "2", 'w') as outfile:
        json.dump(obj, outfile)

tot = 0
# for f in listFiles:
#     clean(f)

clean("115.json")
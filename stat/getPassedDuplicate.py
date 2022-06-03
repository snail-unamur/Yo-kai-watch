import json
import os, os.path
import matplotlib.pyplot as plt


fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\passed_by_letters.json'
f = open(fileName)
data = json.load(f)


obj = {}

for letter in data:
    keys = []
    nbComponents = 0
    for component in data[letter]["components"]:
        nbComponents += 1
        if(component["key"] not in keys):
            keys += [component["key"]]

    obj[letter] = {
        "totalNumber":nbComponents,
        "uniqueNumber":len(keys)
    }
    print(obj[letter])


with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    json.dump(obj, outfile)
import requests
import json
import os, os.path
import time

folderPath = 'D:\\Github\\Yo-Kai-Watch\\stat\\letters\\'
listFiles = os.listdir(folderPath)

tot = 0
obj = {
    "components":[]
}
for f in listFiles:
    print(f)
    fileName = folderPath + f
    file = open(fileName)
    data = json.load(file)

    comp_temp = data[list(data.keys())[0]]
    obj["components"] += comp_temp
    nbComponents = len(comp_temp)
    print(nbComponents)
    tot += nbComponents

print(tot)

unique = {}
print(len(obj["components"]))
compUnique = []
for component in obj["components"]:
    if(component["key"] not in unique):
        unique[component["key"]] = {}
        compUnique += [component]
        print(len(unique))

obj = {
    "components": compUnique
}
print(len(obj["components"]))

with open('D:\\Github\\Yo-Kai-Watch\\stat\\theBig.json', 'w') as outfile:
        json.dump(obj, outfile)
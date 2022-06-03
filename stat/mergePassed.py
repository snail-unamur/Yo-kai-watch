import requests
import json
import os, os.path
import time


fileName = "100"
filePath = 'D:\\Github\\Yo-Kai-Watch\\stat\\passed\\'+fileName+'.json'
f = open(filePath)
data = json.load(f)

def rec(obj, let=""):
    components = []
    for letter in obj["subnames"]:
        print(let+letter)
        components += obj["subnames"][letter]["components"]
        components += rec(obj["subnames"][letter], let+letter)
    return components


obj = {
    "components": rec(data)
}

unique = []
print(len(obj["components"]))
compUnique = []
for component in obj["components"]:
    if(component["name"][0] == "d"):# and component["key"] not in unique):
        unique += [component["key"]]
        compUnique += [component]
        #print(len(unique))

obj = {
    "components": compUnique
}
print(len(obj["components"]))

with open('D:\\Github\\Yo-Kai-Watch\\stat\\passed\\' + fileName + "_merged2.json", 'w') as outfile:
        json.dump(obj, outfile)
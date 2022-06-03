import json
import os, os.path


fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\clean__repartition_letter_and_language.json'
f = open(fileName)

data = json.load(f)

tot = 0
for key in data:
    tot += data[key]["number"]

print(tot)
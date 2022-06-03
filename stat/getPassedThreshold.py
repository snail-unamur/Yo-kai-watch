import json
import os, os.path


fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\clean__repartition_letter_and_language.json'
f = open(fileName)

data = json.load(f)

obj = {
    
}


for key in data:
    if(data[key]["number"] > 10000):
        obj[key] = data[key]
    

with open('repartition_letter_passed (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    json.dump(obj, outfile)
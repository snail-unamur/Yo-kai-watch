import json
import os, os.path


fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\repartition_letter_and_language.json'
f = open(fileName)

data = json.load(f)

todel = []

for key in data:
    if(data[key]["number"] == 0):
        todel += key

    if(ord(key) >= ord("A") and ord(key) <= ord("Z")):
        todel += key
    print(ord(key))
print(todel)
for tod in todel:
    del data[tod]

with open('repartition_letter_and_language__clean (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    json.dump(data, outfile)
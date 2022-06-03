import json
import os, os.path

fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\facet_repartition.json'
f = open(fileName)
facetsData = json.load(f)


fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\repartition_letter_passed.json'
f = open(fileName)
lettersPassedData = json.load(f)

""""
obj = {
    "a": {
        "number": 1111,
        "facets": {
            "ncloc":{
                ">10000":false,
                "biggest":1111,
                "tot":1111
            }
        }
    }
}

"""
obj = {}

for letter in facetsData:
    obj[letter] = {
        "number": lettersPassedData[letter]["number"],
        "facets":{

        }
    }
    for facet in facetsData[letter]:
        if(facetsData[letter][facet] is None):
            continue
        biggest = 0
        total = 0

        print(facet)
        for value in facetsData[letter][facet][0]["values"]:
            c = value["count"]
            total += c
            if(c > biggest):
                biggest = c

        obj[letter]["facets"][facet] = {
                ">10000":biggest>10000,
                "biggest":biggest,
                "tot":total
        }


        
with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    json.dump(obj, outfile)
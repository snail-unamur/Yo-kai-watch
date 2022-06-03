import requests
import json
import os, os.path
import time

getPassing = True

if(getPassing):
    # File name to query letters passing the threshold
    fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\repartition_letter_passed.json'

    url = 'https://sonarcloud.io/api/components/search_projects?p={pageNumber}&ps={pageSize}&filter=query={query}&f=analysisDate&s=analysisDate&asc=true'
    
    fileOutputSuffix = "__reversed"
    startAfter = 0

else:
    # File name to query all letters
    fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\clean__repartition_letter_and_language.json'

    url = 'https://sonarcloud.io/api/components/search_projects?p={pageNumber}&ps={pageSize}&filter=query={query}&f=analysisDate&s=analysisDate&asc=false'

    fileOutputSuffix = ""
    startAfter = 115

def clean(letter, components):
    file = open('D:\\Github\\Yo-Kai-Watch\\stat\\letters\\' + str(ord(letter)) + ".json")
    data = json.load(file)

    idData = len(data[letter]) - 1
    toDelFrom = 0

    for id, component in enumerate(components):
        if(component["key"] == data[letter][idData]["key"]):
            toDelFrom = id

    newComponents = components[:toDelFrom]
    return newComponents


f = open(fileName)

data = json.load(f)

pageSize = 500


for letter in data:
    if(ord(letter) <= startAfter):
        continue

    print("########  " + letter + "  ########")
    obj = { letter: [] }
    pageNumber = 1

    request = requests.get(url.format(pageNumber=pageNumber, pageSize=pageSize, query=letter)).json()
    time.sleep(3)

    while("components" in request and len(request["components"]) == pageSize):
        print(request["paging"])
        obj[letter] += request["components"]
        pageNumber += 1
        request = requests.get(url.format(pageNumber=pageNumber, pageSize=pageSize, query=letter)).json()
        print(pageNumber)
        time.sleep(3)

    if("components" in request):
        obj[letter] += request["components"]


    if(getPassing):
        obj[letter] = clean(letter, obj[letter])

    with open('D:\\Github\\Yo-Kai-Watch\\stat\\letters\\' + str(ord(letter)) + fileOutputSuffix + ".json", 'w') as outfile:
        json.dump(obj, outfile)
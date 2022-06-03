import requests
import json
import os, os.path
import time
facets = [
    #"duplicated_lines_density", 
    "languages",
]
# URL example
# https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&facets=ncloc%2Clanguages&ps=50&f=analysisDate&filter=languages%20%3D%20xml%20and%20query%20%3D%20%22aa%22&s=analysisDate&asc=false
pageSize = 500
pageNumber = 1
url = 'https://sonarcloud.io/api/components/search_projects?p={pageNumber}&ps={pageSize}&filter=query={query} and {facetName}={facetValue}'


"""
obj = {
    "a": [{ "value":..., ""..}]
}
"""
obj = {}


fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\facet_repartition.json'
f = open(fileName)
lettersPassed = json.load(f)

fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\facetCandidates.json'
f = open(fileName)
facetsStats = json.load(f)


def getValues(letter, facetName):
    return lettersPassed[letter][facetName][0]["values"]
    for f in lettersPassed[letter]:
        if(f["property"] == facetName):
            return f["values"]

def request(query, facet):
    ret = []

    pageSize = 500
    pageNumber = 1



    for facetValue in getValues(query, facet):
        pageNumber = 1

        urlTemp = url.format(pageNumber=pageNumber, pageSize=pageSize, query=query, facetName=facet, facetValue=facetValue["val"])
        print(urlTemp)
        request = requests.get(urlTemp).json()
        time.sleep(3)

        while(len(request["components"]) == pageSize):
            ret += request["components"]
            time.sleep(3)
            pageNumber += 1

            urlTemp = url.format(pageNumber=pageNumber, pageSize=pageSize, query=query, facetName=facet, facetValue=facetValue["val"])
            print(urlTemp)
            request = requests.get(urlTemp).json()
        ret += request["components"]
            


    return ret

for letter in lettersPassed:
    print("########" + letter + "########")
    obj[letter] = {
        "components": []
    }

    if(not facetsStats[letter]["facets"][facets[0]][">10000"]):
        # get with this one
        f = facets[0]
    else:
        # get with the other one
        f = facets[1]
    obj[letter]["components"] += request(letter, f)


with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    json.dump(obj, outfile)
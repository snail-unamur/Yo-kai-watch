import requests
import json
import os, os.path
import time
facets = [
    "alert_status", 
    "coverage", 
    "duplicated_lines_density", 
    "languages", 
    "ncloc", 
    "new_coverage", 
    "new_duplicated_lines_density", 
    "new_lines", 
    "new_maintainability_rating", 
    "new_reliability_rating", 
    "new_security_hotspots_reviewed", 
    "new_security_rating", 
    "new_security_review_rating", 
    "reliability_rating", 
    "security_hotspots_reviewed", 
    "security_rating", 
    "security_review_rating", 
    "sqale_rating", 
    "tag"
]


    
url = 'https://sonarcloud.io/api/components/search_projects?p=1&ps=500&facets={facet}&filter=query={query}'


"""
obj = {
    "a": [{ "value":..., ""..}]
}
"""
obj = {}


fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\repartition_letter_passed.json'
f = open(fileName)

lettersPassed = json.load(f)


def requestFacet(url):
    request = requests.get(url).json()
    try:
        print(request["facets"][0]["values"])
    except KeyError:
        print(request)
        return None
    return request["facets"]


for letter in lettersPassed:
    obj[letter] = {}

    for facet in facets:
        u = url.format(facet=facet, query=letter)
        print(u)
        obj[letter][facet] = requestFacet(u)
        time.sleep(3)


with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    json.dump(obj, outfile)
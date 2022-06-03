# "requests" must be installed in order to work 
# Command to install on windows with python installed and added to path : py -m pip install requests
from numpy import char
import requests
import json
import os, os.path
import time

# Back to issue with SonarCloud API route : "sonarcloud.io/api/components/search_projects".
# We can't get all projects. Only get pages with a maximum size of 500.
# Additionally, we can't query projects after the 10000th: {'errors': [{'msg': 'Can return only the first 10000 results. 240000th result asked.'}]} 
# But on the SonarCloud forum a guy says that it is possible
# https://community.sonarsource.com/t/list-of-all-public-projects-on-sonarcloud-using-api/33551
# But it's not working here. 
pageSize = 500
pageNumber = 1

urlBlank = 'https://sonarcloud.io/api/components/search_projects?p={pageNumber}&ps={pageSize}'

urlQuery = 'https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&ps=25&p=1&f=analysisDate&filter=query={query}&s=analysisDate&asc=false'

#urlQueryCustom = 'https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&p={pageNumber}&ps={pageSize}&f=analysisDate&filter=query={query}&s=analysisDate&asc=false'
urlQueryCustom = 'https://sonarcloud.io/api/components/search_projects?p={pageNumber}&ps={pageSize}&f=analysisDate&filter=query={query}&s=analysisDate&asc=false'


def getByName(name):
    time.sleep(1.5)
    if(name == ""):
        request = requests.get(urlBlank.format(pageNumber=pageNumber, pageSize=pageSize)).json()
    else:
        request = requests.get(urlQuery.format(query=name)).json()

    try:
        temp = request["paging"]["total"]
    except KeyError:
        request = None

    return request



def getAll(prefix=""):
    obj = {
        "subnames":{},
        "components":[],
        "error":""
    }
    nbFound = 0

    request = getByName(prefix)

    if(request is None):
        return 0
    else:
        total = request["paging"]["total"]


    if(total <  10000):
        print("< 10000: " + prefix + " : " + str(total))
        # get page by page
        nbPage = total/pageSize
        if(int(nbPage) != nbPage):
            nbPage = int(nbPage) + 1
        else:
            nbPage = int(nbPage)

        for pageNumber in range(1, nbPage + 1):
            time.sleep(1.5)
            request = requests.get(urlQueryCustom.format(pageNumber=pageNumber, pageSize=pageSize, query=prefix)).json()
            try:
                obj["components"] += request["components"]
                nbFound += len(request["components"])
            except:
                obj["error"] = request
            print("page " + str(pageNumber))

    else:
        print("a-z: " + prefix + " : " + str(total))
        # need to split
        for charId in range(ord("a"), ord('z')+1):
            obj["subnames"][chr(charId)] = getAll(prefix + chr(charId))
            nbFound += len(obj["subnames"][chr(charId)]["components"])

    print(prefix + " : " + str(nbFound))
    return obj

passed = ["d", "a", "c", "m", "p", "s", "t"]
passed = ["("]
objBig = {
    "subnames":{},
    "components":[],
    "error":""
}
"""
obj = {
    "subnames":{
        "a": {
            "subnames":{
                "ab": ..
            }
        }
    },
    "component":[],
    "error":""
}
"""
for char in passed:
    objBig["subnames"][char] = getAll(char)

    with open('D:\\Github\\Yo-Kai-Watch\\stat\\passed\\' + str(ord(char)) + ".json", 'w') as outfile:
        json.dump(objBig, outfile)
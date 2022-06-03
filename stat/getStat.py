# "requests" must be installed in order to work 
# Command to install on windows with python installed and added to path : py -m pip install requests
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
"""Value of parameter 'facets' (projects) must be one of: 
[
    alert_status, 
    coverage, 
    duplicated_lines_density, 
    languages, 
    ncloc, 
    new_coverage, 
    new_duplicated_lines_density, 
    new_lines, 
    new_maintainability_rating, 
    new_reliability_rating, 
    new_security_hotspots_reviewed, 
    new_security_rating, 
    new_security_review_rating, 
    reliability_rating, 
    security_hotspots_reviewed, 
    security_rating, 
    security_review_rating, 
    sqale_rating, 
    tag
]
"""

# insteresting to use if we need to filter more the data
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
url = 'https://sonarcloud.io/api/components/search_projects?p={pageNumber}&ps={pageSize}&filter=languages=xml&facets={facet}'
#url = 'https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&p={pageNumber}&ps={pageSize}&f=analysisDate&s=analysisDate&asc=false&facets=projects'
#url = 'https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&facets=ncloc%2Clanguages&p=480&ps=500&f=analysisDate&s=analysisDate&asc=false'
#url = 'https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&ps=25&p=380&f=analysisDate&filter=query=a&s=analysisDate&asc=false'
urlQuery = 'https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&ps=25&p=380&f=analysisDate&filter=query={query}&s=analysisDate&asc=false'

urlQuery = 'https://sonarcloud.io/api/components/search_projects?ps=25&p=380&filter=query={query}&facets=languages'

urlAll = 'https://sonarcloud.io/api/components/search_projects?ps=25&p=380'
#url = 'https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&p=3&ps=25&f=analysisDate&s=analysisDate&asc=false'

toWrite = {"val":[]}
"""
def getUrl(url):
    global totalNbOfPublicProjects
    request = requests.get(url).json()
    try:
        #print(request)
        print(request["facets"][0]["value"])
    except KeyError:
        print(request)
    return request["facets"]

for facet in facets:
    toWrite["val"] += [getUrl(url.format(facet=facet, pageNumber=pageNumber, pageSize=pageSize))]
    time.sleep(3)
    with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
        json.dump(toWrite, outfile)



firstRequest = requests.get(url.format(pageNumber=pageNumber, pageSize=pageSize)).json()
try:
    #print(firstRequest)
    totalNbOfPublicProjects = firstRequest["paging"]["total"]
    print(totalNbOfPublicProjects)
except KeyError:
    print(firstRequest)"""

obj = {

}



totalNbOfPublicProjects = 0
def getByName(name):
    global totalNbOfPublicProjects
    request = requests.get(urlQuery.format(query=name)).json()
    try:
        #print(request)
        #print(request["facets"])
        nbOfPublicProjects = request["paging"]["total"]
        t = 0
        totL = 0
        for f in request["facets"][0]['values']:
            print(f)
            c = f["count"]
            totL += c
            if(c > t):
                t = c
        print(t)
        obj[name] = {
            "number":nbOfPublicProjects,
            "facets":request["facets"],
            "max_language":t,
            "tot_languages":totL
        }

        
        print(name + " :: " + str(nbOfPublicProjects))
        totalNbOfPublicProjects += nbOfPublicProjects

    except KeyError:
        print("##################  ERROR  ###################")
        print(request)
        print("################  ERROR END  #################")

for charId in range(129, 131):
    getByName(chr(charId))
    time.sleep(3)

print(totalNbOfPublicProjects)


request = requests.get(urlAll.format()).json()
print(request["paging"]["total"])

with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    json.dump(obj, outfile)


# Using a JSON string
#with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    #json.dump(firstRequest, outfile)

#print(object)

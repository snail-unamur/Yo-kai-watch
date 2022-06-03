# "requests" must be installed in order to work 
# Command to install on windows with python installed and added to path : py -m pip install requests
import requests
import json
import os, os.path
import time
pageSize = 500
pageNumber = 1

url = 'https://sonarcloud.io/api/components/search_projects?p={pageNumber}&ps={pageSize}&f=analysisDate&s=analysisDate&asc=false'

obj = {
    "components":[]
}


request = requests.get(url.format(pageNumber=pageNumber, pageSize=pageSize)).json()
print(request)

while("errors" not in request):
    obj["components"] += request["components"]
    time.sleep(3)
    pageNumber += 1
    request = requests.get(url.format(pageNumber=pageNumber, pageSize=pageSize)).json()
    print(pageNumber)


with open('json_data (' + str(len(os.listdir('./'))) + ').json', 'w') as outfile:
    json.dump(obj, outfile)
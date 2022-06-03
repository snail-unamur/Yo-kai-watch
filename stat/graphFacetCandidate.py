import json
import os, os.path
import matplotlib.pyplot as plt
"""
In this graph, the data bigger than 10000 are eliminated.
The line is the exact number of projects 
"""


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
    "sqale_rating"
]

s = ""

for id, f in enumerate(facets):
    s += str(id+1) + ". " + f + ", "
s = s[:-2]
print(s)
fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\facetCandidates.json'
f = open(fileName)
data = json.load(f)

occ = []
letters = []

obj = {}

for letter in data:
    letters += [letter]
    fac = []
    dataTemp = []
    true10000 = []
    for id, f in enumerate(facets):

        fac += [str(id+1)]
        
        if(data[letter]["facets"][f][">10000"]):
            true10000 += ["#e15f41"]
        else:
            true10000 += ["royalblue"]

        if(not f in data[letter]["facets"]):
            dataTemp += [0]
        else:
            dataTemp += [data[letter]["facets"][f]["tot"]]

    print(dataTemp)
    obj[letter] = {
        "facets":fac,
        "number":data[letter]["number"],
        "data": dataTemp,
        ">10000":true10000
    }
    


nbColumn = 2
nbRow = int(len(letters)/nbColumn)


# nbColumn = 2
# nbRow = 1
if(len(letters)%nbColumn != 0):
    nbRow += 1

fig, axs = plt.subplots(nbRow, nbColumn)
id = 0
for ax in axs.flat:
    if(id >= len(letters)):
        fig.delaxes(ax)
        continue
    letter = letters[id]

    bar = ax.bar(obj[letter]["facets"], obj[letter]["data"], color=obj[letter][">10000"])

    # for id, b in enumerate(obj[letter][">10000"]):
    #     if(b):
    #         bar[id].set_color("r")

    ax.axhline(y=obj[letter]["number"],linewidth=1, color='k')
    ax.set_title(letter)
    ax.axes.yaxis.set_ticklabels([])

    id += 1
fig.tight_layout()
plt.show()

import json
import os, os.path
import matplotlib.pyplot as plt

pathImage = 'D:\\Github\\Yo-Kai-Watch\\images\\sonarCloud_stat\\globalImages\\'

fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\repartitionFacetGlobal.json'
f = open(fileName)
data = json.load(f)

for facet in data["facets"]:
    fileOutName = facet["property"]
    occ = []
    axeX = []

    for val in facet["values"]:
        occ += [val["count"]]
        axeX += [val["val"]]

    plt.bar(axeX, occ)
    plt.ylabel('Number of projects')
    plt.xlabel(fileOutName)

    plt.savefig(pathImage + fileOutName + ".png", bbox_inches='tight')
    plt.clf()

    print("\\begin{figure}[ht!]\n\t\centering\includegraphics[width=1\linewidth]{"+"D:/Github/Yo-Kai-Watch/images/sonarCloud_stat/globalImages/" + fileOutName + ".png"+"}\n\end{figure}")



import json
import os, os.path
import matplotlib.pyplot as plt

fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\clean__repartition_letter_and_language.json'
f = open(fileName)

data = json.load(f)

occ = []
axeX = []

for i in range(129):
    character = chr(i)
    if(character in data):
        pass
        axeX += [character]
        occ += [data[character]["number"]]


plt.axhline(y=10000,linewidth=1, color='k')
plt.bar(axeX, occ)
plt.ylabel('Nb of projects')
plt.xlabel('Character')
plt.show()


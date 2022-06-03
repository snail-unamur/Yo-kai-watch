import json
import os, os.path
import matplotlib.pyplot as plt

fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\facet_repartition.json'
f = open(fileName)

data = json.load(f)

occ = []
letters = []

for letter in data:
    letters += [letter]
    



names = ['group_a', 'group_b', 'group_c']
values = [1, 10, 100]
plt.figure(figsize=(9, 3))

plt.subplot(131)
plt.bar(names, values)
plt.subplot(132)
plt.scatter(names, values)
plt.subplot(133)
plt.plot(names, values)
plt.suptitle('Categorical Plotting')
plt.show()

nbColumn = 3
nbRow = int(len(letters)/nbColumn)
if(len(letters)%nbColumn != 0):
    nbRow += 1

fig, axs = plt.subplots(nbColumn, nbRow)
id = 0
for ax in axs.flat:
    letter = letters[id]

    ax.plot()
    ax.set_title()
    ax.set(xlabel='x-label', ylabel='y-label')

    id += 1
from re import T
import requests
import json
import os, os.path
import time


fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\repartition_letter_passed.json'
f = open(fileName)
data = json.load(f)

tot = 0
for l in data:
    t = data[l]["number"] - 10000
    if(t>0):
        tot += t

print("Total loss: " + str(tot))
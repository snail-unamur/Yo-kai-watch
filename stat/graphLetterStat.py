import json
import os, os.path
import matplotlib.pyplot as plt

def totUni():

    fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\letterStat.json'
    f = open(fileName)

    data = json.load(f)
    tot = []
    unique = []
    axeX = []

    width = 0.35
    x1 = []
    x2 = []
    x = []
    id = 0
    mean = 0
    for letter in data:
        t = data[letter]["totalNumber"]
        u = data[letter]["uniqueNumber"]
        mean += u/t
        axeX += [letter]
        tot += [t]
        unique += [u]
        x += [id]
        x1 += [id - width/2]
        x2 += [id + width/2]
        id += 1
    mean = mean/len(x)
    print(mean)

    fig, ax = plt.subplots()
    rects1 = ax.bar(x1, tot, width, label='Total')
    rects2 = ax.bar(x2, unique, width, label='Unique')
    ax.set_xticks(x, axeX)
    ax.legend()
    plt.ylabel('Number of projects')
    plt.xlabel('Letter queried')

    fig.tight_layout()
    plt.show()

def totUniExpected():

    fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\letterStat.json'
    f = open(fileName)
    data = json.load(f)


    fileName = 'D:\\Github\\Yo-Kai-Watch\\stat\\repartition_letter_passed.json'
    f = open(fileName)
    expectedData = json.load(f)

    tot = []
    unique = []
    expected = []
    axeX = []

    width = 0.30
    x1 = []
    x2 = []
    x3 = []
    x = []
    id = 0
    mean = 0
    meanE = 0
    for letter in data:
        t = data[letter]["totalNumber"]
        u = data[letter]["uniqueNumber"]
        e = expectedData[letter]["number"]
        mean += u/t
        meanE += u/e
        axeX += [letter]
        tot += [t]
        unique += [u]
        expected += [e]
        x += [id]
        x1 += [id - width*3/4]
        x2 += [id]
        x3 += [id + width*3/4]
        id += 1
    mean = mean/len(x)
    meanE = meanE/len(x)
    print("Uni/Tot" + str(mean))
    print("Uni/Exp" + str(meanE))

    fig, ax = plt.subplots()
    rects1 = ax.bar(x1, tot, width, label='Total')
    rects3 = ax.bar(x2, expected, width, label='Expected')
    rects2 = ax.bar(x3, unique, width, label='Unique')
    ax.set_xticks(x, axeX)
    ax.legend()
    plt.ylabel('Number of projects')
    plt.xlabel('Letter queried')

    fig.tight_layout()
    plt.show()

totUniExpected()
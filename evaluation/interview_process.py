import json
import os, os.path
import matplotlib.pyplot as plt
files = [
    "2022-04-05 09_30 coded transcript final.txt"
]
fileName = files[0]
pathFile = 'D:\\Github\\Yo-Kai-Watch\\evaluation\\interview_data\\' + fileName

f = open(pathFile, 'r', encoding="utf8")

categories = {
    "LAG": [
        "LAG",
        "LAG-SOLUTION"
    ],
    "SCALE_DIRECTION": [
        "SCALE_DIRECTION-NOT_INTUITIVE",
        "SCALE_DIRECTION-EXPERIENCE",
        "SCALE_DIRECTION-LEFT_TO_RIGHT"
    ],
    "GAMIFICATION_SPLIT": [
        "GAMIFICATION_SPLIT-ISSUE",
        "GAMIFICATION_SPLIT-TOOL_INFORMATION",
        "GAMIFICATION_SPLIT-GAME_LESS_INFORMATION"
    ],
    "UNCATEGORIZED":[]
}

tags = []
questions = {}
for i in range(1, 11):
    questions[str(i)] = {
        "nb":0,
        "tags":[]
    }

nbLine = 0
nbLineNotQuestionRelated = 0
questionRelatedId = 0
for line in f:
    nbLine += 1
    tagsFound = []
    export = ""
    started = False
    questionRelated = False
    for c in line:
        if(started):
            if(c == "]"):
                started = False
                if(export[0] == "T"):
                    tag = export.split(":")[1]
                    if(tag not in tags):
                        tagsFound += [tag]

                elif(export[0] == "Q"):
                    questionRelated = True
                    question = export.split(":")[1]
                    questionRelatedId = question
                    questions[question]["nb"] += 1

                export = ""
            else:
                export += c
        if(c == "["):
            started = True
    if(not questionRelated):
        nbLineNotQuestionRelated += 1
        pass
        #print(line)
    else:
        questions[questionRelatedId]["tags"] += tagsFound
    tags += tagsFound

print(str(nbLine) + ":" + str(len(tags))+":" + str(nbLineNotQuestionRelated))
p = ""
categories = {}
for tag in tags:
    found = False
    for q in questions:
        if(tag in questions[q]["tags"]):
            found = True
            break
    if(not found):
        tagList = tag.split("-")
        thisCat = tagList[0]

        if(thisCat not in categories):
            p += tag + ", "
            categories[thisCat] = []

        if(len(tagList) > 1):
            categories[thisCat].append(tagList[1])
        else:
            categories[thisCat].append("null")

print(p)
print()
p = ""
for cat in categories:
    p += cat + ", "
print(p)
print()
for question in questions:
    print("Question #" + question + ": ")
    for t in questions[question]["tags"]:
        print("" + t)


for cat in categories:
    print(cat + ":")
    for c in categories[cat]:
        print("    " + c)

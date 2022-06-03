import matplotlib.pyplot as plt
from collections import Counter
import os


print(os.path.dirname(__file__))
pathImage = os.path.join(os.path.dirname(__file__), '{}.png')

def genGraph(counter, fileOutName="funky"):
    nb_interviews = []
    kendall_values = []

    for i in range(6):
        key = i*2/10
        kendall_values.append(key)
        nb_interviews.append(counter[key])

    print(kendall_values)
    print(nb_interviews)
    fig, ax = plt.subplots()

    ax.spines["right"].set_visible(False)
    ax.spines["top"].set_visible(False)
    ax.spines["bottom"].set_visible(False)

    plt.title("{} scale ordering accuracy".format(fileOutName.capitalize()), loc="left", fontdict={"weight":"bold"})

    colors = ["#6E1248", "#B00DB2", "#8F00FF", "#5134FF", "#6868FF", "#9CBEFF"]

    plt.xlim(0, 13)
    plt.ylim(-0.05, 1.05)
    plt.xticks([i for i in range(13)])
    plt.grid(True, alpha=0.7, axis="x", zorder=0)
    plt.barh(kendall_values, nb_interviews, align="center", height=0.12, zorder=3, color=colors[::-1])
    plt.ylabel(labelY, fontdict={"style":"italic"})
    plt.xlabel(labelX, fontdict={"style":"italic"})

    for i, line in enumerate(ax.get_xgridlines()):
        if(i %2 == 0):
            line.set_alpha(0.7)
        else:
            line.set_alpha(0.4)


    plt.tick_params(
        bottom=False,
        top=False,
        right=False,
        left=False
    )

    plt.savefig(pathImage.format(fileOutName))
    plt.clf()

def genGraphTestFullColoredBar(counter, fileOutName="funky"):
    nb_interviews = []
    kendall_values = []

    for i in range(6):
        key = i*2/10
        kendall_values.append(key)
        nb_interviews.append(counter[key])

    print(kendall_values)
    print(nb_interviews)
    fig, ax = plt.subplots()

    ax.spines["right"].set_visible(False)
    ax.spines["top"].set_visible(False)
    ax.spines["bottom"].set_visible(False)

    plt.title("{} scale ordering accuracy".format(fileOutName.capitalize()), loc="left", fontdict={"weight":"bold"})

    colors = ["#6E1248", "#B00DB2", "#8F00FF", "#5134FF", "#6868FF", "#9CBEFF"]

    plt.xlim(0, 13)
    plt.ylim(-0.1, 1.1)
    plt.xticks([i for i in range(13)])
    plt.grid(True, alpha=0.7, axis="x", zorder=0)
    plt.barh(kendall_values, [13 for _ in kendall_values], align="center", height=0.15, zorder=0, color=colors[::-1], alpha=0.3)
    plt.barh(kendall_values, nb_interviews, align="center", height=0.12, zorder=3, color=colors[::-1])
    plt.ylabel(labelY, fontdict={"style":"italic"})
    plt.xlabel(labelX, fontdict={"style":"italic"})

    for i, line in enumerate(ax.get_xgridlines()):
        if(i %2 == 0):
            line.set_alpha(0.7)
        else:
            line.set_alpha(0.4)


    plt.tick_params(
        bottom=False,
        top=False,
        right=False,
        left=False
    )

    plt.savefig(pathImage.format(fileOutName+"test"))
    plt.clf()

funky = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0.8, 0.8, 0.4]
rainbow = [0.8, 0.8, 0.8, 0.8, 0.8, 1, 1, 0.6, 0.4, 0.4, 0.4, 0.2, 0.2]
labelY = "Kendall's tau coefficient value"
labelX = "Number of interviews"
music = [1, 1, 1, 1, 1, 1, 0.4, 0.4, 0.2, 0.2, 0.2, 0]

counter_funky = Counter(funky)
counter_rainbow = Counter(rainbow)
counter_music = Counter(music)

genGraph(counter_funky)
genGraph(counter_rainbow, "rainbow")

genGraphTestFullColoredBar(counter_funky)
genGraphTestFullColoredBar(counter_rainbow, "rainbow")

genGraphTestFullColoredBar(counter_music, "music")
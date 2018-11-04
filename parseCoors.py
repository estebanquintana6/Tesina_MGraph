import csv
import json
import glob
import os
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

import sys

coordinate_file = sys.argv[1]
save_folder = sys.argv[2]
clusters = 1

if(len(sys.argv) > 3):
    clusters = int(sys.argv[3])
    print("Clusters: " + str(clusters))

coordinates = []

def map_coordinates():
    min_x = [x['x'] for x in coordinates]
    min_x = min(min_x)

    min_y = [x['y'] for x in coordinates]
    min_y = min(min_y)

    if min_x < 0:
        for i in range(0,len(coordinates)):
            coordinates[i]["x"] = (3.5*( coordinates[i]["x"] + abs(min_x) )) + 30

    if min_y < 0:
        for i in range(0,len(coordinates)):
            coordinates[i]["y"] = (3.5*( coordinates[i]["y"] + abs(min_y) )) + 30

def get_coordiates(file):
    coors = np.genfromtxt(file, delimiter=',')
    clf = KMeans(n_clusters = clusters)
    clf.fit(coors)

    labels = clf.labels_
    print(labels)

    with open(file) as f:
        csvReader = csv.reader(f)
        itercsv = iter(csvReader)
        i = 0
        for row in itercsv:
            c = {
                "x": float(row[0]),
                "y": float(row[1]),
                "population": labels[i]
            }
            i = i+1
            coordinates.append(c)

    map_coordinates()
    c = ''.join(str(e) for e in coordinates)
    c = c.replace(" ","").replace("}{", "},{").replace("'", '"')
    c = "[" + c + "]"

    p = ''
    for idx, l in enumerate(labels):
        if idx != (len(labels) - 1):
            p = p + str(l) + ','
        else:
            p = p + str(l)

    p = '[' + p + ']'

    jsonpath = save_folder + '/mapped_coordinates.json'
    population = save_folder + '/cluster_info.json'

    with open(jsonpath , 'w') as f:
        f.write(c)
    with open(population, 'w') as f:
        f.write(p)


get_coordiates(coordinate_file)

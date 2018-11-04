import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import os

import sys

coordinate_file = sys.argv[1]
save_folder = sys.argv[2]
clusters = int(sys.argv[3])

def getClusters(file):
    coors = np.genfromtxt(file, delimiter=',')
    clf = KMeans(n_clusters = clusters)
    clf.fit(coors)

    labels = clf.labels_
    print(labels)
    p = ''

    for idx, l in enumerate(labels):
        if idx != (len(labels) - 1):
            p = p + str(l) + ','
        else:
            p = p + str(l)

    p = '[' + p + ']'

    population = save_folder + '/cluster_info.json'

    with open(population, 'w') as f:
        f.write(p)

getClusters(coordinate_file)

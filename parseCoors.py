import csv
import json
import glob
import os

import sys

coordinate_file = sys.argv[1]
save_folder = sys.argv[2]

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
    with open(file) as f:
        csvReader = csv.reader(f)
        itercsv = iter(csvReader)
        for row in itercsv:
            c = {
                "x": float(row[0]),
                "y": float(row[1])
            }
            coordinates.append(c)

    map_coordinates()
    c = ''.join(str(e) for e in coordinates)
    c = c.replace(" ","").replace("}{", "},{").replace("'", '"')
    c = "[" + c + "]"

    jsonpath = save_folder + '/mapped_coordinates.json'

    with open(jsonpath , 'w') as f:
        f.write(c)


get_coordiates(coordinate_file)

import csv
import json
import glob
import os

import sys

path = sys.argv[1]
coordinate_file = sys.argv[2]
coordinates = []

path += '/*.csv'

def map_coordinates():
    min_x = [x['x'] for x in coordinates]
    min_x = min(min_x)

    min_y = [x['y'] for x in coordinates]
    min_y = min(min_y)

    if min_x < 0:
        for i in range(0,len(coordinates)):
            coordinates[i]["x"] = (3*( coordinates[i]["x"] + abs(min_x) )) + 30

    if min_y < 0:
        for i in range(0,len(coordinates)):
            coordinates[i]["y"] = (3*( coordinates[i]["y"] + abs(min_y) )) + 30

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

    jsonpath = sys.argv[1] + '/mapped_coordinates.json'

    with open(jsonpath , 'w') as f:
        f.write(c)

def parse_files():
    for filename in glob.glob(path):
        csvfile = os.path.splitext(filename)[0]
        txtfile = csvfile + '.txt'
        matrix = []

        coorname = os.path.basename(coordinate_file)
        csvn = os.path.basename(filename)

        if str(coorname) == str(csvn): continue
        print(coorname)
        print(csvn)

        print(filename)

        with open(csvfile+'.csv') as f:
            csvReader = csv.reader(f)
            itercsv = iter(csvReader)
            next(itercsv)
            for row in itercsv:
                newlist = row[2:]
                matrix.append(newlist)

        text =''.join(str(e) for e in matrix)
        text = text.replace(" ","").replace("][","], [").replace("'", "")

        with open(txtfile, 'w') as f:
            f.write(text)

get_coordiates(coordinate_file)
parse_files()

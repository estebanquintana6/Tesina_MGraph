import csv
import json
import glob
import os

import sys

path = sys.argv[1]
path += '/*.csv'

for filename in glob.glob(path):
    csvfile = os.path.splitext(filename)[0]
    txtfile = csvfile + '.txt'
    matrix = []


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

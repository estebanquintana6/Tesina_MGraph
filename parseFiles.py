import csv
import json
import glob
import os

import sys

files = sys.argv[1]
header = ""
files = files.split(',')
path = os.path.dirname(files[0])

def parse_files():
    headerspath = path + '/headers.json'

    for filename in files:
        csvfile = os.path.splitext(filename)[0]
        txtfile = csvfile + '.txt'
        matrix = []

        print(filename)

        with open(csvfile+'.csv') as f:
            csvReader = csv.reader(f)
            itercsv = iter(csvReader)
            header = next(itercsv)
            header = header[2:]
            header =  str(header).replace("'",'"')

            for row in itercsv:
                newlist = row[2:]
                matrix.append(newlist)

        text =''.join(str(e) for e in matrix)
        text = text.replace(" ","").replace("][","], [").replace("'", "")

        with open(txtfile, 'w') as f:
            f.write(text)

        with open(headerspath, 'w') as h:
            h.write(header)

parse_files()

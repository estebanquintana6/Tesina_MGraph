import csv
import json
import glob
import os

import sys

files = sys.argv[1]
header = ""
files = files.split(',')
files.sort()
path = os.path.dirname(files[0])

txtfiles = []

joinfile = {}

matrixfile = path + '/matrix.json'



def parse_files():
    headerspath = path + '/headers.json'
    i = 0
    for filename in files:
        csvfile = os.path.splitext(filename)[0]
        matrix = []

        txtfile = os.path.dirname(os.path.abspath(filename)) + '\\' + str(i) + '.txt'
        i = i + 1

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
        text = '[' +  text + ']'
        joinfile[i] = text

        with open(headerspath, 'w') as h:
            h.write(header)

parse_files()

print(joinfile)

json_data = json.dumps(joinfile)
json_data = json_data.replace('"[[',"[[").replace('"]]', "]]").replace('",', ",").replace('"}', "}")

with open(matrixfile, 'w') as f:
    f.write(json_data)

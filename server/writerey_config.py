import sys

host = 'localhost'
port = '5002'
basePath = '_writerey_data'
metaSubPath = '_writerey_meta'
labelPath = '_writerey_label'
linksFileName = '_writerey_links'
debugMode = False

def getAppPath():
    return sys.argv[1]
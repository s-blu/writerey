from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath

import os
import json


class Directories(Resource):
    def get(self):
        directoryStructure = {
            'files': []
        }
        for (dirpath, dirnames, filenames) in os.walk(basePath):
            path = dirpath.replace('\\', '/').split('/')
            path.pop(0)  # removes unneeded basePath
            print('=====================================')
            print('DIR PATH', path)

            if (path[-1] == metaSubPath):
                print('oopsie metasub', path)
                continue

            if path[0] == '':
                currDir = directoryStructure
            else:
                walkToDir = directoryStructure
                for pathStep in path:
                    print('next pathstep', pathStep)
                    walkToDir = walkToDir[pathStep]
                print('walkToDir...', walkToDir)
                currDir = walkToDir
                # directoryStructure[dirpath] = currDir
                print('updated dirStr', directoryStructure)
                # print(currDir)
                # print(directoryStructure)

            for f in filenames:
                print('FILE :', f, os.path.join(dirpath, f))
                currDir['files'].append(f)
            for d in dirnames:
                print('DIRECTORY :', d, os.path.join(dirpath, d))
                if d != metaSubPath:
                    currDir[d] = {
                        'files': []
                    }

            print('finished currDir', currDir)
            print('dirStructure', directoryStructure)

        return json.dumps(directoryStructure)  # directoryStructure

    def put(self, doc_name):
        return 'Not implemented yet'

from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath

import os
import json

class Directories(Resource):
    def get(self):
        directoryStructure = {
            'name': '',
            'dirs': [],
            'files': []
        }
        for (dirpath, dirnames, filenames) in os.walk(basePath):
            path = dirpath.replace('\\', '/').split('/')
            path.pop(0)  # removes unneeded basePath

            if (path[-1] == metaSubPath):
                continue # skip meta paths

            if path[0] == '':
                currDir = directoryStructure
            else:
                walkToDir = directoryStructure
                for pathStep in path:
                    walkToDir = next(
                        (sub for sub in walkToDir['dirs'] if sub['name'] == pathStep), {})
                currDir = walkToDir

            for f in filenames:
                currDir['files'].append({
                    'name': f,
                    'path': dirpath
                })
            for d in dirnames:
                if d != metaSubPath:
                    currDir['dirs'].append({
                        'name': d,
                        'dirs': [],
                        'files': []
                    })

        return json.dumps(directoryStructure)

    def put(self, doc_name):
        return 'Not implemented yet'

from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath
from pathUtils import PathUtils

import os
import json
from logger import Logger


class Directories(Resource):
    def get(self):
        log = Logger('directories.get')
        directoryStructure = {
            'name': '',
            'dirs': [],
            'files': []
        }
        for (dirpath, dirnames, filenames) in os.walk(basePath):
            path = dirpath.replace('\\', '/').split('/')
            path.pop(0)  # removes unneeded basePath
            filePath = PathUtils.concatPathParts(path)

            if (len(path) == 0 or metaSubPath in path):
                log.logDebug('skipping path', path)
                continue  # skip meta paths

            if len(path) == 1 and path[0] == '':
                currDir = directoryStructure
                log.logDebug('Got root, using directory Structure directly')
            else:
                log.logDebug('walking for', dirpath, path)
                currDir = self.walkToDir(directoryStructure, path)
                if currDir == None:
                    log.logWarn(
                        'Could not find dir for path, skipping', dirpath)
                    continue
            self.crawlDirContent(dirnames, filenames, currDir, filePath)
        return json.dumps(directoryStructure)

    def put(self, doc_name):
        return 'Not implemented yet'

    @staticmethod
    def walkToDir(tree, path):
        dirStep = tree
        for pathStep in path:
            dirStep = next(
                (sub for sub in dirStep['dirs'] if sub['name'] == pathStep), None)
        return dirStep

    @staticmethod
    def crawlDirContent(dirnames, filenames, currDir, filePath):
        for f in filenames:
            currDir['files'].append({
                'name': f,
                'path': filePath
            })
        for d in dirnames:
            if d != metaSubPath:
                currDir['dirs'].append({
                    'name': d,
                    'dirs': [],
                    'files': []
                })

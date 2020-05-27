from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath
from pathUtils import PathUtils

import os
import json
from logger import Logger


class Tree(Resource):
    def get(self):
        log = Logger('directories.get')
        directoryStructure = {
            'name': '',
            'dirs': [],
            'files': []
        }
        treeBase = request.args.get('base')
        log.logDebug('========== GET TREE =========')       
        log.logDebug('os.getcwd:', os.getcwd())
        log.logDebug('base:', treeBase)
        log.logDebug('==========')
        for (dirpath, dirnames, filenames) in os.walk(basePath):
            filePath = PathUtils.sanitizePathString(dirpath, True)
            path = filePath.split('/')
            log.logDebug('starting with', path, dirpath)

            if (metaSubPath in dirnames):
                log.logDebug('removing metaSubPath from dirnames to exclude them from walking')
                dirnames.remove(metaSubPath) # do not visit metaSubPaths
            
            if (len(path) == 0 or metaSubPath in path):
                log.logDebug('skipping path', path)
                continue  # skip meta paths

            if (treeBase and len(path) > 1 and treeBase not in path):
                log.logDebug('skipping path since its not part of treeBase', path)
                continue 

            if len(path) == 1 and path[0] == '':
                currDir = directoryStructure
                log.logDebug('Got tree root, using directory Structure directly')
            else:
                log.logDebug('walking for', dirpath, path)
                currDir = self.walkToDir(directoryStructure, path)
                if currDir == None:
                    log.logWarn(
                        'Could not find dir for path, skipping', dirpath)
                    continue
            log.logDebug('crawling content', currDir, filePath)
            self.crawlDirContent(dirnames, filenames, currDir, filePath)
            if request.args.get('root_only'):
                break
        result = directoryStructure
        if (treeBase): 
            result = next((x for x in directoryStructure['dirs'] if x['name'] == treeBase), result)

        return json.dumps(result)

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
                'path': filePath,
                'isFile': True
            })
        for d in dirnames:
            if d != metaSubPath:
                currDir['dirs'].append({
                    'name': d,
                    'path': filePath,
                    'dirs': [],
                    'files': []
                })

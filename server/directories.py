from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath
from pathUtils import PathUtils

import os
import json
from logger import Logger


class Directories(Resource):
    def get(self, dir_name):
        return 'Not implemented yet'

    def put(self, dir_name):
        log = Logger('directories.put')
        log.logDebug('put called', dir_name)
        dir_name = PathUtils.sanitizeFilename(dir_name)
        if not request.form or (not request.form['doc_path'] and not request.form['root_dir']):
            log.logWarn(
                'directories put was called with invalid data. Do nothing.')
            return None
        newPath = PathUtils.sanitizePathList(
                [basePath, request.form['doc_path'], dir_name])
        log.logDebug('saving path', newPath)
        Path(newPath).mkdir()
        log.logDebug('mkdir:', {'path': PathUtils.sanitizePathString(newPath, True)})
        return {'path': PathUtils.sanitizePathString(newPath, True)}

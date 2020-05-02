from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath
from pathUtils import PathUtils

import os
from stat import ST_MTIME

linkFileName = '_writerey_links'

class Links(Resource):
    def get(self, project_dir):
        try:
            linkFile = PathUtils.sanitizePathList([basePath, project_dir, metaSubPath, linkFileName])
            f = open(linkFile, encoding='utf-8')
            content = f.read()

            return content
        except OSError as err:
            print('get links failed', err)
            return '' #abort(500, err)

    def put(self, project_dir):
        pathToLinks = PathUtils.sanitizePathList([basePath, project_dir, metaSubPath])
        Path(pathToLinks).mkdir(parents=True, exist_ok=True)
        filePath = PathUtils.sanitizePathList([pathToLinks, linkFileName])
        # TODO check if this is available
        f = request.files['file']
        f.save(filePath)
        fileRead = open(filePath, encoding='utf-8')
        return fileRead.read()

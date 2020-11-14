# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import os
from pathlib import Path
from stat import ST_MTIME

from flask import abort, request
from flask_restful import Resource
from logger import Logger
from pathUtils import PathUtils
from writerey_config import basePath, metaSubPath

linkFileName = '_writerey_links'

class Links(Resource):
    log = Logger('Links')
    def get(self, project_dir):
        try:
            linkFile = PathUtils.sanitizePathList([basePath, project_dir, metaSubPath, linkFileName])
            f = open(linkFile, encoding='utf-8')
            content = f.read()

            return content
        except FileNotFoundError:
            print('get links file not found')
            abort(404) # FIXME i remember that this was a bad idea for some reason
        except OSError as err:
            self.log.logError('get links failed with OSError', err)
            abort(500)

    def put(self, project_dir):
        pathToLinks = PathUtils.sanitizePathList([basePath, project_dir, metaSubPath])
        Path(pathToLinks).mkdir(parents=True, exist_ok=True)
        filePath = PathUtils.sanitizePathList([pathToLinks, linkFileName])
        try:
            f = request.files['file']
        except:
            abort(400, 'No or invalid file given')
        f.save(filePath)
        fileRead = open(filePath, encoding='utf-8')
        return fileRead.read()

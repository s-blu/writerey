# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import request, abort
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath
from pathUtils import PathUtils

import os
import json
import shutil
from logger import Logger


class Directories(Resource):
    log = Logger('directories')

    def get(self, dir_name):
        abort(501, 'not implemented')

    def put(self, dir_name):
        self.log.logDebug('put called', dir_name)
        dir_name = PathUtils.sanitizeFilename(dir_name)
        if not request.form or (not request.form['doc_path'] and not request.form['root_dir']):
            self.log.logWarn(
                'directories put was called with invalid data.')
            abort(400, 'Invalid Parameters')
        newPath = PathUtils.sanitizePathList(
                [basePath, request.form['doc_path'], dir_name])
        self.log.logDebug('saving path', newPath)
        Path(newPath).mkdir()
        self.log.logDebug('mkdir:', {'path': PathUtils.sanitizePathString(newPath, True)})
        return {'path': PathUtils.sanitizePathString(newPath, True)}

    def delete(self, dir_name): 
        if request.args.get('dir_path'):
            pathToDelete = PathUtils.sanitizePathList(
                [basePath, request.args.get('dir_path')])
        else:
            pathToDelete = basePath
        dirPath = PathUtils.sanitizePathList([pathToDelete, dir_name])
        self.log.logDebug('will delete directory', dirPath)
        if not os.path.exists(dirPath):
            abort(400, 'Dir for deletion was not found')
        
        shutil.rmtree(dirPath)

        return {}

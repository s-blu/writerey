# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath
from pathUtils import PathUtils

import os
from stat import ST_MTIME


class Documents(Resource):
    def get(self, doc_name):
        try:
            path = PathUtils.sanitizePathList(
                [basePath, request.args.get('doc_path'), doc_name])
            f = open(path, encoding='utf-8')
            response = self.getResponseObject(f)
            if request.args.get('with_content'):
                content = f.read()
                response['content'] = content
            return response
        except OSError as err:
            print('get document failed', err)
            return ''  # TODO send an error back here

    def put(self, doc_name):
        if request.form['doc_path']:
            pathToSaveTo = PathUtils.sanitizePathList(
                [basePath, request.form['doc_path']])
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = basePath
        name = PathUtils.sanitizeFilename(doc_name)
        filePath = PathUtils.sanitizePathList([pathToSaveTo, name])
        # TODO check if this is available
        f = request.files['file']
        f.save(filePath)
        return self.getResponseObject(open(filePath, encoding='utf-8'))

    def getResponseObject(self, file):
        fstats = os.stat(file.name)
        return {
            'path': PathUtils.sanitizePathString(os.path.dirname(file.name), True),
            'name': os.path.basename(file.name),
            'last_edited': fstats[ST_MTIME]
        }

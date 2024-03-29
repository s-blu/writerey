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
from logger import Logger

import os
import shutil
from stat import ST_MTIME


class Documents(Resource):
    log = Logger('Documents')

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
        except FileNotFoundError:
            self.log.logWarn('document not found', doc_name)
            abort(404)
        except OSError:
            self.log.logWarn('OSError on getting document', doc_name)
            abort(500) 

    def put(self, doc_name):
        if request.form['doc_path']:
            pathToSaveTo = PathUtils.sanitizePathList(
                [basePath, request.form['doc_path']])
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = basePath
        name = PathUtils.sanitizeFilename(doc_name)
        filePath = PathUtils.sanitizePathList([pathToSaveTo, name])
        try:
            f = request.files['file']
        except:
            abort(400, 'No or invalid file given')

        f.save(filePath)
        return self.getResponseObject(open(filePath, encoding='utf-8'))

    def delete(self, doc_name):
        if request.args.get('doc_path'):
            pathToDelete = PathUtils.sanitizePathList(
                [basePath, request.args.get('doc_path')])
        else:
            pathToDelete = basePath

        filePath = PathUtils.sanitizePathList([pathToDelete, doc_name])
        if not os.path.exists(filePath):
            abort(400, 'File for deletion was not found')
        
        os.remove(filePath)

        meta_path = PathUtils.sanitizePathList([pathToDelete, metaSubPath, doc_name])
        metaExists = os.path.exists(meta_path)
        if (metaExists):
            shutil.rmtree(meta_path)

        return {}

    def getResponseObject(self, file):
        fstats = os.stat(file.name)
        return {
            'path': PathUtils.sanitizePathString(os.path.dirname(file.name), True),
            'name': os.path.basename(file.name),
            'last_edited': fstats[ST_MTIME]
        }

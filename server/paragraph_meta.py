# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import request
from flask_restful import Resource
from pathlib import Path
from pathUtils import PathUtils
from writerey_config import basePath, metaSubPath


class ParagraphMeta(Resource):
    def get(self, doc_name):
        path = request.args.get('doc_path')
        context = request.args.get('context')
        try:
            path = PathUtils.sanitizePathList(
                [basePath, path, metaSubPath, doc_name, context])
            f = open(path, encoding='utf-8')
            content = f.read()
            return content
        except OSError as err:
            print('get paragraph meta failed', err)
            return ''

    def put(self, doc_name):
        context = request.form['context']
        if request.form['doc_path']:
            pathParts = [basePath, request.form['doc_path'], metaSubPath, doc_name]
        else:
            pathParts = [basePath, metaSubPath, doc_name]
        dirPath = PathUtils.sanitizePathList(pathParts)
        Path(dirPath).mkdir(parents=True, exist_ok=True)
        
        pathToSaveTo = PathUtils.sanitizePathList([dirPath, context])
        f = request.files['file']
        f.save(pathToSaveTo)
        savedF = open(pathToSaveTo, 'r', encoding='utf-8')
        newContent = savedF.read()

        return newContent

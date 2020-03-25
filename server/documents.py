from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath
from pathUtils import PathUtils


class Documents(Resource):
    def get(self, doc_name):
        path = request.args.get('doc_path')
        try:
            path = PathUtils.sanitizePathList([basePath, path, doc_name])
            f = open(path, encoding='utf-8')
            content = f.read()
            return content
        except OSError as err:
            print('get paragraph meta failed', err)
            return ''

    def put(self, doc_name):
        if request.form['doc_path']:
            pathToSaveTo = PathUtils.sanitizePathList(
                [basePath, request.form['doc_path']])
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = basePath
        # TODO sanitize filename
        filePath = PathUtils.sanitizePathList([pathToSaveTo, doc_name])
        # TODO check if this is available
        f = request.files['file']
        f.save(filePath)

        return { 'path': filePath, 'name': doc_name}

from flask import request
from flask_restful import Resource
from pathlib import Path
from pathUtils import PathUtils
from writerey_config import basePath, metaSubPath


class ParagraphMeta(Resource):
    def get(self, doc_name):
        path = request.args.get('doc_path')
        pId = request.args.get('p_id')
        filename = doc_name + '_' + pId
        try:
            path = PathUtils.sanitizePathList(
                [basePath, path, metaSubPath, filename])
            f = open(path, encoding='utf-8')
            content = f.read()
            return content
        except OSError as err:
            print('get paragraph meta failed', err)
            return ''

    def put(self, doc_name):
        pId = request.form['p_id']
        filename = doc_name + '_' + pId
        if request.form['doc_path']:
            pathToSaveTo = PathUtils.sanitizePathList(
                [basePath, request.form['doc_path'], metaSubPath, filename])
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = PathUtils.sanitizePathList(
                [basePath, metaSubPath, filename])
        # TODO do this here and sent content as file obj
        # f = request.files['file']
        # f.save(filePath)
        content = request.form['content']
        f = open(pathToSaveTo, 'w')
        f.write(content)
        f.close()

        return content

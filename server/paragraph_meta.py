from flask import request
from flask_restful import Resource
from pathlib import Path

from writerey_config import basePath, metaSubPath

class ParagraphMeta(Resource):
    def get(self, doc_name):
        path = request.args.get('doc_path')
        pId = request.args.get('p_id')
        # TODO: error handling if file is not available/openable
        try:
            f = open(basePath + path + metaSubPath +
                     doc_name + '_' + pId, encoding='utf-8')
            content = f.read()
            return content
        except:
            return ''

    def put(self, doc_name):
        pId = request.form['p_id']
        content = request.form['content']
        print(pId, content)
        if request.form['doc_path']:
            # TODO: Make sure this ends on a / and does not start with a /
            # TODO: Sanitize
            pathToSaveTo = basePath + request.form['doc_path'] + metaSubPath + '/'
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = basePath + metaSubPath + '/'
        # TODO sanitize filename
        filePath = pathToSaveTo + doc_name + '_' + pId
        f = open(filePath, 'w')
        f.write(content)
        f.close()

        return content

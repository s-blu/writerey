from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath

class Documents(Resource):
    def get(self, doc_name):
        path = request.args.get('doc_path')
        # TODO: error handling if file is not available/openable
        f = open(basePath + path + doc_name, encoding='utf-8')
        content = f.read()
        return content

    def put(self, doc_name):
        if request.form['doc_path']:
            # TODO: Make sure this ends on a / and does not start with a /
            # TODO: Sanitize
            pathToSaveTo = basePath + request.form['doc_path']
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = basePath
        # TODO sanitize filename
        filePath = pathToSaveTo + doc_name
        # TODO check if this is available
        f = request.files['file']
        f.save(filePath)

        return 'File saved to ' + filePath

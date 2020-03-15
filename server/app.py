from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
api = Api(app)
CORS(app)  # resources={r"*": {"origins": '*'}})  # boooh. FIXME.

basePath = '_writerey_data/'


class Documents(Resource):
    def get(self, doc_name):
        return 'Documents get is not implemented yet'

    def put(self, doc_name):
        if request.form['doc_path']:
            # TODO: Make sure this ends on a / and does not start with a /
            # TODO: Sanitize
            pathToSaveTo = basePath + request.form['doc_path']
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = basePath
        # TODO sanitize filename
        filePath = pathToSaveTo + doc_name + '_file.html'
        # TODO check if this is available
        f = request.files['file']
        f.save(filePath)

        return 'File saved to ' + filePath


api.add_resource(Documents, '/doc/<string:doc_name>')

if __name__ == '__main__':
    app.run(port=5002, debug=True)  # FIXME remove debug

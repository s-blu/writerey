from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
api = Api(app)
CORS(app)  # resources={r"*": {"origins": '*'}})  # boooh. FIXME.

basePath = '_writerey_data/'  # FIXME change me back to _writerey_data/
metaSubPath = '/_writerey_meta/'


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
            pathToSaveTo = basePath + request.form['doc_path'] + metaSubPath
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = basePath + metaSubPath
        # TODO sanitize filename
        filePath = pathToSaveTo + doc_name + '_' + pId
        f = open(filePath, 'w')
        f.write(content)
        f.close()

        return 'Paragraph Meta saved to ' + filePath


api.add_resource(Documents, '/doc/<string:doc_name>')
api.add_resource(ParagraphMeta, '/p/<string:doc_name>')

if __name__ == '__main__':
    app.run(port=5002, debug=True)  # FIXME remove debug

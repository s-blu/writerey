from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
api = Api(app)
CORS(app)  # resources={r"*": {"origins": '*'}})  # boooh. fixme.

basePath = '_writerey_data/'


class Documents(Resource):
    def get(self, doc_name):
        return 'Documents get is not implemented yet'

    def put(self, doc_name):
        if request.form['doc_path']:
            # TODO: Make sure this ends on a / and does not start with a /
            pathToSaveTo = basePath + request.form['doc_path']
            Path(pathToSaveTo).mkdir(parents=True, exist_ok=True)
        else:
            pathToSaveTo = basePath
        print(request.form)
        #f = request.files['file']
        #f.save(pathToSaveTo + doc_name + '.html')
        f = open(pathToSaveTo + doc_name + '.html', 'w')
        f.write(request.form['content'])
        f.close()


api.add_resource(Documents, '/doc/<string:doc_name>')

if __name__ == '__main__':
    app.run(port=5002, debug=True)  # fixme remove debug

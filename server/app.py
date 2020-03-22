from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from pathlib import Path

from documents import Documents
from paragraph_meta import ParagraphMeta
from writerey_config import basePath, metaSubPath

app = Flask(__name__)
api = Api(app)
CORS(app)  # resources={r"*": {"origins": '*'}})  # boooh. FIXME.

api.add_resource(Documents, '/doc/<string:doc_name>')
api.add_resource(ParagraphMeta, '/p/<string:doc_name>')

if __name__ == '__main__':
    app.run(port=5002, debug=True)  # FIXME remove debug

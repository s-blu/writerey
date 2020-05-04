from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from pathlib import Path

from documents import Documents
from label import Labels
from paragraph_meta import ParagraphMeta
from directories import Directories
from git import GitAutomation
from gitTag import Tag
from gitMv import GitMove
from tree import Tree
from links import Links
from writerey_config import basePath, metaSubPath
from waitress import serve

app = Flask(__name__)
api = Api(app)
CORS(app)  # resources={r"*": {"origins": '*'}})  # boooh. FIXME.

api.add_resource(Documents, '/doc/<string:doc_name>')
api.add_resource(ParagraphMeta, '/p/<string:doc_name>')
api.add_resource(Directories, '/dir/<string:dir_name>')
api.add_resource(Labels, '/label/<string:label_id>')
api.add_resource(Links, '/links/<string:project_dir>')
api.add_resource(Tree, '/tree')
api.add_resource(GitAutomation, '/git/commit')
api.add_resource(Tag, '/git/tag')
api.add_resource(GitMove, '/git/mv')

if __name__ == '__main__':
    gitA = GitAutomation()
    gitA.init()
    app.run(port=5002, debug=True)  # FIXME
    # serve(app, listen='localhost:5002')

# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from initialize_env import initialize_env

if __name__ == '__main__':
    initialize_env()

import sys
from pathlib import Path

from directories import Directories
from documents import Documents
from flask import Flask, request
from flask_restful import Api, Resource
from git import GitAutomation
from gitMv import GitMove
from gitTag import Tag
from images import Images
from label import Labels
from labelStats import LabelStats
from links import Links
from paragraph_meta import ParagraphCount, ParagraphMeta
from tree import Tree
from waitress import serve
from writerey_config import basePath, host, metaSubPath, port

app = Flask(__name__)
api = Api(app)

class Ping(Resource):
    def get(self):
        return {'message': 'Server is started up and ready to go. '}

api.add_resource(Ping, '/ping')
api.add_resource(Documents, '/doc/<string:doc_name>')
api.add_resource(Images, '/img/<string:doc_name>')
api.add_resource(ParagraphMeta, '/p/<string:doc_name>')
api.add_resource(ParagraphCount, '/pcount/<string:doc_name>')
api.add_resource(Directories, '/dir/<string:dir_name>')
api.add_resource(Labels, '/label/<string:label_id>')
api.add_resource(LabelStats, '/labelstats/<string:project>')
api.add_resource(Links, '/links/<string:project_dir>')
api.add_resource(Tree, '/tree')
api.add_resource(GitAutomation, '/git/commit')
api.add_resource(Tag, '/git/tag')
api.add_resource(GitMove, '/git/mv')

if __name__ == '__main__':
    args = sys.argv[1:]
    if ('development' in args):
        from flask_cors import CORS
        CORS(app, origins="http://localhost:4200") 

        app.run(port=port, debug=True)
    else:
        serve(app, listen=host + ":" + port)

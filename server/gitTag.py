from flask import request
from flask_restful import Resource
from logger import Logger

from gitUtils import GitUtils

class Tag(Resource):
    logger = Logger('Tag')
    git = GitUtils()

    def get(self):
        return 'not implemented yet'

    def put(self):
        tagname = request.form['tagname']
        if not tagname:
            return 'Got no tagname, nothing to tag'  # FIXME send back an 400
        self.git.run(["git", "tag", tagname])
        return {'tagname': tagname}

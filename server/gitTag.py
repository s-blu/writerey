from flask import request
from flask_restful import Resource
from logger import Logger
from flask import abort


from gitUtils import GitUtils

class Tag(Resource):
    logger = Logger('Tag')
    git = GitUtils()

    def get(self):
        abort(501, 'not implemented yet')

    def put(self):
        tagname = request.form['tagname']
        if not tagname:
            abort(400, 'Got no tagname, nothing to tag')
        self.git.run(["git", "tag", tagname])
        return {'tagname': tagname}

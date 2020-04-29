from flask import request
from flask_restful import Resource
from logger import Logger
from flask import abort
from pathUtils import PathUtils

from gitUtils import GitUtils

class GitMove(Resource):
    logger = Logger('GitMove')
    git = GitUtils()

    def get(self):
        abort(501, 'not implemented yet')

    def put(self, doc_name):
        #TODO BE ABLE TO HANDLE DIRS
        doc_path = request.form['doc_path']
        new_name = request.form['new_doc_name']
        new_doc_path = request.form['new_doc_path']
        msg = request.form['msg']

        self.logger.logDebug('params', doc_name, doc_path, new_name, new_doc_path, msg)

        if not new_name:
            abort(400, 'Got no new name, cannot move')
        if doc_path == new_doc_path and doc_name == new_name:
            abort(400, 'New path and name are identical to existing path and name. Do nothing.')

        old_path = PathUtils.sanitizePathList([doc_path, doc_name])
        new_path = PathUtils.sanitizePathList([new_doc_path, new_name])
        self.logger.logDebug('paths', old_path, new_path)
        if not msg:
            msg = 'Rename ' + old_path + ' to ' + new_path
        if doc_path == new_doc_path and doc_name.lower() == new_name.lower():
            self.logger.logInfo('Rename is only changing case sensitive. Doing extra commit to prevent trouble.', doc_name, '-->', new_name)
            new_path_safe = new_path + '_ptfrcs' # prevent trouble from renaming case sensitivity
            self.git.run(["git", "mv", old_path, new_path_safe])
            self.git.run(["git", "commit", "-m", msg])
            old_path = new_path_safe

        # TODO MOVE META IF AVAILABLE
        result = self.git.run(["git", "mv", old_path, new_path])
        self.git.run(["git", "commit", "-m", msg])
        return {'result': result}

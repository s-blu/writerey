from flask import request
from flask_restful import Resource
from logger import Logger
from flask import abort
from pathUtils import PathUtils
from gitUtils import GitUtils
from writerey_config import metaSubPath
from os import path

class GitMove(Resource):
    logger = Logger('GitMove')
    git = GitUtils()

    def get(self):
        abort(501, 'not implemented yet')

    def put(self):
        #TODO BE ABLE TO HANDLE DIRS
        doc_name = request.form['doc_name']
        doc_path = request.form['doc_path']
        new_name = request.form['new_doc_name']
        new_doc_path = request.form['new_doc_path']
        msg = request.form['msg']

        if doc_name and not new_name:
            abort(400, 'Got no new name, cannot move')
        if not doc_name:
            doc_name = ''
            new_name = ''

        self.logger.logDebug('params', doc_name, doc_path, new_name, new_doc_path, msg)

        if doc_path == new_doc_path and doc_name == new_name:
            abort(400, 'New path and name are identical to existing path and name. Do nothing.')
        
        if doc_path == new_doc_path and doc_name.lower() == new_name.lower():
            self.logger.logInfo('Rename is only changing case sensitivity. Doing extra commit to prevent trouble.', doc_name, '-->', new_name)
            new_name_ptfrcs = new_name[:6] + '_ptfrcs'  # "prevent trouble from renaming case sensitivity"
            self.moveViaGit(doc_path, doc_name, new_doc_path, new_name_ptfrcs, msg)
            doc_name = new_name_ptfrcs

        self.moveViaGit(doc_path, doc_name, new_doc_path, new_name, msg)
        return 'finished'

    def moveViaGit(self, doc_path, doc_name, new_doc_path, new_name, msg):
        old_path = PathUtils.sanitizePathList([doc_path, doc_name])
        new_path = PathUtils.sanitizePathList([new_doc_path, new_name])
        old_meta_path = PathUtils.sanitizePathList([doc_path, metaSubPath, doc_name])
        new_meta_path = PathUtils.sanitizePathList([new_doc_path, metaSubPath, new_name])

        if not msg:
            msg = 'Rename ' + old_path + ' to ' + new_path
        self.git.run(["git", "mv", old_path, new_path])
        if path.exists(old_meta_path):
            self.git.run(["git", "mv", old_meta_path, new_meta_path])
        self.git.run(["git", "commit", "-m", msg])

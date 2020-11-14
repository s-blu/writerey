# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import request
from flask_restful import Resource
from logger import Logger
from flask import abort
from pathUtils import PathUtils
from gitUtils import GitUtils
from writerey_config import basePath, metaSubPath, linksFileName, imagesFileName
from os import path
import shutil

from images import updateImageLinks

class GitMove(Resource):
    logger = Logger('GitMove')
    git = GitUtils()

    def get(self):
        return abort(501, 'not implemented')

    def put(self):
        try:
            doc_path = request.form['doc_path']
            new_doc_path = request.form['new_doc_path']
            project_dir = request.form['project_dir']
            msg = request.form['msg']
        except:
            self.logger.logInfo('put got called with invalid parameters')
            abort(400)

        try:
            doc_name = request.form['doc_name']
            new_name = request.form['new_doc_name']
        except:
            pass

        if doc_name and not new_name:
            abort(400, 'Got no new name, cannot move')
        if not doc_name:
            doc_name = ''
            new_name = ''
            self.logger.logDebug('got no doc_name, want to rename dir, set doc names to empty string')

        if doc_path == new_doc_path and doc_name == new_name:
            self.logger.logInfo('path and name are identical to new path and name, return 400')
            abort(400, 'New path and name are identical to existing path and name.')
        
        if doc_path == new_doc_path and doc_name.lower() == new_name.lower():
            self.logger.logInfo('Rename is only changing case sensitivity. Doing extra commit to prevent trouble.', doc_name, '-->', new_name)
            new_name_ptfrcs = new_name[:6] + '_ptfrcs'  # "prevent trouble from renaming case sensitivity"
            self.moveViaGit(doc_path, doc_name, new_doc_path, new_name_ptfrcs, msg)
            doc_name = new_name_ptfrcs
        self.moveViaGit(doc_path, doc_name, new_doc_path, new_name, msg, project_dir)
        return {'name': new_name or doc_name, 'path': new_doc_path or doc_path}

    def moveViaGit(self, doc_path, doc_name, new_doc_path, new_name, msg, projectDir = None):
        old_path = PathUtils.sanitizePathList([doc_path, doc_name])
        new_path = PathUtils.sanitizePathList([new_doc_path, new_name])
        old_meta_path = PathUtils.sanitizePathList([doc_path, metaSubPath, doc_name])
        new_meta_path = PathUtils.sanitizePathList([new_doc_path, metaSubPath, new_name])
        metaExists = path.exists(PathUtils.sanitizePathList([basePath, old_meta_path]))

        self.logger.logDebug('prepare moving file ...', old_path, new_path)
        self.logger.logDebug('check if moving meta ...', metaExists)
        if metaExists:
            self.logger.logDebug('prepare moving meta ...', old_meta_path, new_meta_path)

        try:
            self.git.run(['git', 'ls-files', '--error-unmatch', old_path])
        except:
            self.logger.logDebug('file is not under version control yet, do a file system move')
            shutil.move(PathUtils.sanitizePathList([basePath, old_path]), PathUtils.sanitizePathList([basePath, new_path])) 
            if (metaExists and new_name):
                self.logger.logDebug('meta exists, moving meta via file system move')
                shutil.move(PathUtils.sanitizePathList([basePath, old_meta_path]), PathUtils.sanitizePathList([basePath, new_meta_path]))
            self.logger.logDebug('updated file, updating image links....')
            updateImageLinks(PathUtils.sanitizePathList([basePath, old_meta_path]), PathUtils.sanitizePathList([basePath, new_meta_path]))
            return
        
        if not msg:
            msg = 'Rename ' + old_path + ' to ' + new_path
        self.git.run(["git", "mv", old_path, new_path])
        if metaExists and new_name:
            self.git.run(["git", "mv", old_meta_path, new_meta_path])
        if projectDir:
            # add links file to the commit, since it possibly get changed on a move 
            linksFilePath = PathUtils.sanitizePathList([projectDir, metaSubPath, linksFileName])
            if path.exists(linksFilePath):
                self.git.run(["git", "add", linksFilePath])
        updateImageLinks(PathUtils.sanitizePathList([basePath, old_meta_path]), PathUtils.sanitizePathList([basePath, new_meta_path]))
        # add image file to the commit, since it possibly get changed on a move 
        try:
            imageMapPath = PathUtils.sanitizePathList([metaSubPath, imagesFileName])
            self.logger.logDebug(f'adding image map to commit ... {imageMapPath} ')
            self.git.run(["git", "add", imageMapPath])
        except:
            self.logger.logWarn('could not add image map to commit')
            pass
        self.git.run(["git", "commit", "-m", msg])

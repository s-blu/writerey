# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import os
import re
import subprocess
from pathlib import Path

from flask import abort, request
from flask_restful import Resource
from gitUtils import GitUtils
from logger import Logger
from pathUtils import PathUtils
from writerey_config import basePath


class GitAutomation(Resource):
    logger = Logger('GitAutomation')
    git = GitUtils()

    def init(self):
        if not os.path.exists('.git'):
            try:
                subprocess.run(['git', 'init'], shell=True, check=True)
                self.git.setGitConfig()
            except:
                msg = 'could not initalize git! Is Git installed on the system?'
                self.logger.logError(msg)
                abort(412, msg)
        else:
            self.logger.logDebug('git is already initialized, do nothing')
        return

    def get(self):
        lastTagName = None
        lastTagDate = None
        lastGitCommit = self.getCommitDate()
        try:
            lastTagName = self.git.run(['git', 'describe'])
            lastTagName = re.sub(
            r"(-[0-9]+-[a-z0-9]+\n$)", "", lastTagName)
        except:
            pass
        
        if lastTagName: 
            lastTagDate = self.getCommitDate(lastTagName)
        return {
            'lastCommitDate': lastGitCommit,
            'lastTagName': lastTagName,
            'lastTagDate': lastTagDate
        }

    def put(self):
        msg = request.form['message']
        if not msg:
            msg = 'Snapshot'
        changesAvailable = self.git.run(['git', 'status', '--porcelain'])
        # only look at changes inside base path 
        changesAvailable = list(filter(lambda line: basePath in line, changesAvailable.splitlines()))

        if not changesAvailable:
            return {'status': -1, 'text': 'Working dir is clean'}
        self.git.run(["git", "add", '.'])
        commitReturn = self.git.run(["git", "commit", '-m', msg])
        return {'status': 0, 'text': commitReturn, 'commitDate': self.getCommitDate()}

    def getCommitDate(self, tag: str = None):
        try:
            if tag:
                cmds = ['git', 'log', '-1', tag, r'--format=%cd']
            else:
                cmds = ['git', 'log', '-1', r'--format=%cd']
            date = self.git.run(cmds)
            return date.replace("\n", "")
        except:
            return ''


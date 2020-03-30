from flask import request
from flask_restful import Resource
from pathlib import Path
from pathUtils import PathUtils
from logger import Logger

import subprocess
import os
import re

from gitUtils import GitUtils


class GitAutomation(Resource):
    logger = Logger('GitAutomation')
    workingDir = os.getcwd()
    git = GitUtils()

    def init(self):
        if not os.path.exists('.git'):
            self.git.run(['dir'])
            self.git.run(['git', 'init'])
            self.git.setGitConfig()
        else:
            self.logger.logDebug('git is already initialized, do nothing')
        return

    def get(self):
        lastGitCommit = self.getCommitDate()
        lastTagName = self.git.run(['git', 'describe'])
        lastTagName = re.sub(
            r"(-[0-9]+-[a-z0-9]+\n$)", "", lastTagName)
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
        if not changesAvailable:
            return {'status': -1, 'text': 'Working dir is clean'}
        self.git.run(["git", "add", '.'])
        commitReturn = self.git.run(["git", "commit", '-m', msg])
        return {'status': 0, 'text': commitReturn}

    def getCommitDate(self, tag: str = None):
        if tag:
            cmds = ['git', 'log', '-1', tag, r'--format=%cd']
        else:
            cmds = ['git', 'log', '-1', r'--format=%cd']
        date = self.git.run(cmds)
        return date.replace("\n", "")

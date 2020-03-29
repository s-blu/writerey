from flask import request
from flask_restful import Resource
from pathlib import Path
from pathUtils import PathUtils
from logger import Logger

import subprocess
import os
import re

# FIXME REMOVE ME AND IMPORT REAL BASEPATH
basePath = 'D:/projekte/_writerey_data'

class GitAutomation(Resource):
    logger = Logger('GitAutomation')
    workingDir = os.getcwd()

    def init(self):
        if not os.path.exists('.git'):
            self.run(['dir'])
            self.run(['git', 'init'])
            pathToGitConfig = PathUtils.sanitizePathList(
                [basePath, '/.git/config'])
            f = open(pathToGitConfig, 'a')
            f.write('[user]\n')
            f.write('\tname = Writerey\n')
            f.write('\temail = writerey@app\n')
            f.close()
        else:
            self.logger.logDebug('git is already initialized, do nothing')
        return

    def get(self):
        lastGitCommit = self.getCommitDate()
        lastTagName = self.run(['git', 'describe'])
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
        self.run(["git", "add", '.'])
        self.run(["git", "commit", '-m', msg])
        return 'bazooonga'

    def run(self, cmds: [str]):
        switchDir = ['cd', basePath, '&&']
        return subprocess.run(switchDir + cmds, shell=True, check=True, stdout=subprocess.PIPE, text=True).stdout

    def getCommitDate(self, tag: str = None):
        if tag:
            cmds = ['git', 'log', '-1', tag, r'--format=%cd']
        else:
            cmds = ['git', 'log', '-1', r'--format=%cd']
        date = self.run(cmds)
        return date.replace("\n", "")

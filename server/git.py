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
        self.switchDir()
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
        self.switchDir(True)

    def get(self):
        # git log -1 --format=%cd # date of last local commit
        # git log -1 --format=%cd TAG # date of tag TAG

        # git log -1 --format=%cd
        # git describe # remove last two elements separated with - to get tag name
        # git log -1 <TAGNAME>
        self.switchDir()
        lastGitCommit = self.getOutput(['git', 'log', '-1', r'--format=%cd'])
        lastGitCommit = lastGitCommit.replace("\n", "")
        lastTagName = self.getOutput(['git', 'describe'])
        print('result!', lastGitCommit, lastTagName)
        lastTagName = re.sub(
            r"(-[0-9]+-[a-z0-9]+\n$)", "", lastTagName)
        lastTagDate = self.getOutput(
            ['git', 'log', '-1', lastTagName, r'--format=%cd'])
        lastTagDate = lastTagDate.replace("\n", "")
        self.switchDir(True)
        return {
            'lastCommitDate': lastGitCommit,
            'lastTagName': lastTagName,
            'lastTagDate': lastTagDate
        }

    def put(self):
        self.switchDir()
        msg = request.form['message']
        if not msg:
            msg = 'Snapshot'
        self.run(["git", "add", '.'])
        self.run(["git", "commit", '-m', msg])
        self.switchDir(True)
        return 'bazooonga'

    def switchDir(self, backToWorkingDir=False):
        if backToWorkingDir:
            os.chdir(self.workingDir)
        else:
            os.chdir(basePath)

    def run(self, cmds: [str]):
        return subprocess.run(cmds, shell=True, check=True)

    def getOutput(self, cmds: [str]):
        return subprocess.check_output(cmds, text=True)

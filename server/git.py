from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath
from pathUtils import PathUtils
from logger import Logger

import subprocess
import os


class GitAutomation(Resource):
    logger = Logger('GitAutomation')

    def init(self):
        devPath = 'D:/projekte/_writerey_data'  # FIXME this needs to be basePath
        wd = os.getcwd()
        os.chdir(devPath)
        if not os.path.exists('.git'):
            self.run(['dir'])
            self.run(['git', 'init'])
            pathToGitConfig = PathUtils.sanitizePathList(
                [devPath, '/.git/config'])
            f = open(pathToGitConfig, 'a')
            f.write('[user]\n')
            f.write('\tname = Writerey\n')
            f.write('\temail = writerey@app\n')
            f.close()
        else:
            self.logger.logDebug('git is already initialized, do nothing')
        os.chdir(wd)

    def get(self, doc_name):
        return 'not implemented yet'

    def put(self):
        msg = request.form['message']
        if not msg:
            msg = 'Snapshot'
        self.run(["git", "add", '.'])
        self.run(["git", "commit", '-m', msg])
        return 'bazooonga'

    def run(self, cmds: [str]):
        return subprocess.run(cmds, shell=True, check=True)

# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.


import subprocess

from logger import Logger
from pathUtils import PathUtils
from writerey_config import basePath


class GitUtils:
    log = Logger('GitUtils')
    def run(self, cmds: [str]):
        try: 
            switchDir = ['cd', basePath, '&&']
            return subprocess.run(switchDir + cmds, shell=True, check=True, stdout=subprocess.PIPE, text=True).stdout
        except:
            self.log.logWarn('git command failed', cmds)


    def setGitConfig(self):
        self.log.logInfo('setting git config ...')
        pathToGitConfig = PathUtils.sanitizePathList(
            ['.git/config'])
        f = open(pathToGitConfig, 'a')
        f.write('[user]\n')
        f.write('\tname = Writerey\n')
        f.write('\temail = writerey@app\n')
        f.close()

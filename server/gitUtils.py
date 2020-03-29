
import subprocess
from pathUtils import PathUtils

# FIXME REMOVE ME AND IMPORT REAL BASEPATH
basePath = 'D:/projekte/_writerey_data'


class GitUtils:
    def run(self, cmds: [str]):
        switchDir = ['cd', basePath, '&&']
        return subprocess.run(switchDir + cmds, shell=True, check=True, stdout=subprocess.PIPE, text=True).stdout

    def setGitConfig(self):
        pathToGitConfig = PathUtils.sanitizePathList(
            [basePath, '/.git/config'])
        f = open(pathToGitConfig, 'a')
        f.write('[user]\n')
        f.write('\tname = Writerey\n')
        f.write('\temail = writerey@app\n')
        f.close()

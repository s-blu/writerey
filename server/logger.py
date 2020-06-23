# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.


from writerey_config import debugMode

import json


class bcolors:
    DEBUG = '\033[30m'
    OK = '\033[92m'
    WARNING = '\033[93m'
    ERROR = '\033[91m'
    END = '\033[0m'


class Logger:
    def __init__(self, pre=''):
        self.prefix = pre

    def logDebug(self, *msg):
        if (debugMode):
            print(f'{bcolors.DEBUG}[debug]{bcolors.END}',
                  '[' + self.prefix + ']', self.parseToString(*msg))

    def logInfo(self, *msg):
        print('[Info] [' + self.prefix + ']', self.parseToString(*msg))

    def logWarn(self, *msg):
        print(f'{bcolors.WARNING}-[WARN]{bcolors.END}',
              '[' + self.prefix + ']', self.parseToString(*msg))

    def parseToString(self, *msg):
        concatted = ''
        for m in msg:
            try:
                concatted += ' ' + m
            except:
                try:
                    m = json.dumps(m)
                    concatted += ' ' + m
                except:
                    pass
        return concatted

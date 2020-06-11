# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from functools import reduce
from writerey_config import basePath
import re
import os

# TODO try to use os.path.normpath here


class PathUtils:
    @staticmethod
    def concatPathParts(pathParts):
        parts = pathParts[:]
        if len(parts) == 0:
            return ''
        # TODO error handling if parts is empty/no list
        path = parts[0]
        parts.pop(0)
        for p in parts:
            if p == '':
                continue
            if p.endswith('/'):
                p = p[:-1]
            if not p.startswith('/'):
                p = '/' + p
            path = path + p
        return path

    @staticmethod
    def sanitizePathString(pathStr: str, removeBasePath: bool = False):
        if not pathStr or pathStr == '':
            return pathStr
        path = pathStr.replace('\\', '/').split('/')
        if removeBasePath and path[0] == basePath:
            path.pop(0)
        # TODO remove illegal characters from path
        path = list(filter(lambda el: el != '', path))
        return PathUtils.concatPathParts(path)

    @staticmethod
    def sanitizePathList(pathList: [str], removeBasePath: bool = False):
        if not pathList or len(pathList) == 0:
            return ''
        pathConcat = PathUtils.concatPathParts(pathList)
        return PathUtils.sanitizePathString(pathConcat, removeBasePath)

    @staticmethod
    def sanitizeFilename(filename: str):
        if not filename or filename == '':
            return ''
        return re.sub(r'([/\\<>\*\?:\'"])', '_', filename)

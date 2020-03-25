from functools import reduce
from writerey_config import basePath


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
            if not p.startswith('/'):
                p = '/' + p
            if p.endswith('/'):
                p = p[:-1]
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
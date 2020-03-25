from functools import reduce

class PathUtils:
    @staticmethod
    def concatPathParts(pathParts):
        parts = pathParts[:]
        # TODO error handling if parts is empty/no list
        path = parts[0]
        parts.pop(0)
        # TODO is this handling even necessary after split? shouldnt all / be gone?
        if path.endswith('/'):
            path = path[:-1]
        for p in parts:
            if not p.startswith('/'):
                p = '/' + p
            if p.endswith('/'):
                p = p[:-1]
            path = path + p
        return path

    @staticmethod
    def sanitizePath(pathStr: str):
        if not pathStr or pathStr == '':
            return pathStr
        path = pathStr.replace('\\', '/').split('/')
        # TODO remove illegal characters from path
        path = list(filter(lambda el: el != '', path))
        return PathUtils.concatPathParts(path)


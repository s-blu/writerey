class PathUtils:
    @staticmethod
    def concatPathParts(parts):
        # TODO error handling if parts is empty/no list
        path = parts[0]
        parts.pop(0)
        if path.endswith('/'):
            path = path[:-1]
        for p in parts:
            if not p.startswith('/'):
                p = '/' + p
            if p.endswith('/'):
                p = p[:-1]
            path = path + p
        return path

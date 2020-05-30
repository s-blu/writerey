from flask import request, send_file
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath, host, port
from pathUtils import PathUtils

import os
from stat import ST_MTIME


class Images(Resource):
    def get(self, doc_name):
        path = request.args.get('doc_path')
        image_name = request.args.get('image_name')
        try:
            # fixme this path will probably change in the build version
            path = PathUtils.sanitizePathList(
                ['..', basePath, path, metaSubPath, doc_name, image_name])

            return send_file(path)
        except OSError as err:
            print('get image failed', err)
            return None

    def post(self, doc_name):
        path = request.headers['docpath']
        if path:
            pathParts = [basePath, path, metaSubPath, doc_name]
        else:
            pathParts = [basePath, metaSubPath, doc_name]
        dirPath = PathUtils.sanitizePathList(pathParts)
        Path(dirPath).mkdir(parents=True, exist_ok=True)
        f = request.files['upload']
        name = PathUtils.sanitizeFilename(f.filename)
        filePath = PathUtils.sanitizePathList([dirPath, name])
        
        f.save(filePath)
        return { "url": self.getUrlForImage(doc_name, f.filename, path)}

    def getUrlForImage(self, doc_name,image_name, doc_path):
        url = f'http://{host}:{port}/img/{doc_name}?image_name={image_name}'
        if (doc_path):
            url += '&doc_path=' + doc_path
        return url

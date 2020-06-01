from flask import request, send_from_directory
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath, host, port
from pathUtils import PathUtils

import os, sys
from stat import ST_MTIME


class Images(Resource):
    def get(self, doc_name):
        path = request.args.get('doc_path')
        image_name = request.args.get('image_name')
        path = PathUtils.sanitizePathList([os.getcwd(), basePath, path, metaSubPath, doc_name])
        return send_from_directory(path, filename=image_name)


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

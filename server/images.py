# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import os
import re
import sys
import uuid
from pathlib import Path
from stat import ST_MTIME

from flask import abort, request, send_from_directory
from flask_restful import Resource
from logger import Logger
from pathUtils import PathUtils
from writerey_config import basePath, host, imagesFileName, metaSubPath, port


class Images(Resource):
    log = Logger('images')
    def get(self, doc_name):
        try: 
            path = PathUtils.sanitizePathList([os.getcwd(), self.getPathForImageId(doc_name)])
            self.log.logDebug(f'sending file {doc_name} from {path} ....')
            return send_from_directory(path, filename=doc_name)
        except FileNotFoundError:
            abort(404)
        except OSError:
            abort(500)


    def post(self, doc_name):
        imgId = str(uuid.uuid4().hex[:8])

        path = request.headers['docpath']
        if path:
            pathParts = [basePath, path, metaSubPath, doc_name]
        else:
            pathParts = [basePath, metaSubPath, doc_name]
        dirPath = PathUtils.sanitizePathList(pathParts)
        Path(dirPath).mkdir(parents=True, exist_ok=True)

        f = request.files['upload']
        name = PathUtils.sanitizeFilename(f.filename)
        name = f'{imgId}_{name}'        

        filePath = PathUtils.sanitizePathList([dirPath, name])
        self.log.logDebug(f'saving new image in {filePath}')
        f.save(filePath)

        self.addMappingToImageFile(name, dirPath)

        return { "url": self.getUrlForImage(doc_name, name, path)}

    def getUrlForImage(self, doc_name,image_name, doc_path):
        url = f'http://{host}:{port}/img/{image_name}'
        return url

    def addMappingToImageFile(self, image_id, dir_path):
        pathParts = [basePath, metaSubPath]
        imageMapPath = PathUtils.sanitizePathList(pathParts)
        Path(imageMapPath).mkdir(parents=True, exist_ok=True)
        imageMapFile = PathUtils.sanitizePathList([imageMapPath, imagesFileName])

        with open(imageMapFile, 'a+', encoding='utf-8') as file:
            newLine = f'{image_id} "{dir_path}"\n'
            self.log.logDebug(f'adding new entry to image map: {newLine}')
            file.write(newLine)
            file.close()

    def getPathForImageId(self, image_id):
        try:
            imageMapPath = PathUtils.sanitizePathList([basePath, metaSubPath, imagesFileName])
            file =  open(imageMapPath, 'r', encoding='utf-8')
            pathForImage = re.search(f'{image_id} "(.*)"\n', file.read())
        except FileNotFoundError:
            self.log.logWarn('Could not find image map file, cannot resolve image links!')
            abort(500)

        if not pathForImage:
            self.log.logWarn(f'could not resolve path for image {image_id}')
            abort(410, 'could not resolve image_id to path, no mapping available')

        self.log.logDebug(f'resolved for image {image_id} path {pathForImage.group(1)}')
        return pathForImage.group(1)

def updateImageLinks(oldPath, newPath):
    log = Logger('updateImageLinks')
    imageMapPath = PathUtils.sanitizePathList([basePath, metaSubPath, imagesFileName])
    # Get content of image map file
    file_handle =  open(imageMapPath, 'r', encoding='utf-8')
    file_string = file_handle.read()
    file_handle.close()
    
    regex = f'(.+? ")({oldPath})(.*"\n)'
    log.logDebug('trying to find and replace oldPath in image file', oldPath)
    file_string = re.sub(regex, r'\1' + newPath + r'\3', file_string)

    # Overwrite image map file with updated content
    file_handle = open(imageMapPath, 'w')
    file_handle.write(file_string)
    file_handle.close()
    return True

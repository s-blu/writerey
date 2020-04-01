from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath, markerPath
from pathUtils import PathUtils

import os
from stat import ST_MTIME

pathToMarkers = PathUtils.sanitizePathList([basePath, metaSubPath, markerPath])


class Markers(Resource):
    def get(self, marker_id):
        value_id = request.args.get('value_id')
        try:
            markerFile = self.getMarkerValPath(marker_id, value_id)
            f = open(markerFile, encoding='utf-8')
            content = f.read()

            return content
        except OSError as err:
            print('get markers failed', err)
            return ''  # TODO send an error back here

    def put(self, marker_id):
        value_id = request.args.get('value_id')
        Path(pathToMarkers).mkdir(parents=True, exist_ok=True)
        markerFilePath = self.getMarkerValPath(marker_id, value_id)
        # TODO check if this is available
        f = request.files['file']
        f.save(markerFilePath)
        fileRead = open(markerFilePath, encoding='utf-8')
        return fileRead.read()

    def getMarkerValPath(self, marker_id, value_id):
        if marker_id == 'definitions':
            return PathUtils.sanitizePathList([pathToMarkers, '_writerey_marker_defs'])
        else:
            return PathUtils.sanitizePathList([pathToMarkers, 'mv_' + value_id])

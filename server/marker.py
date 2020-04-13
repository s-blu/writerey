from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath, markerPath
from pathUtils import PathUtils

import os
from stat import ST_MTIME

class Markers(Resource):
    def get(self, marker_id):
        value_id = request.args.get('value_id')
        projectDir = request.args.get('project')
        try:
            markerFile = self.getMarkerValPath(marker_id, value_id, projectDir)
            f = open(markerFile, encoding='utf-8')
            content = f.read()

            return content
        except OSError as err:
            print('get markers failed', err)
            return ''  # TODO send an error back here

    def put(self, marker_id):
        if marker_id != 'definitions':
            value_id = request.form['value_id']
        else:
            value_id = ''
        projectDir = request.form['project']
        pathToMarkers = self.getPathToMarkers(projectDir)
        Path(pathToMarkers).mkdir(parents=True, exist_ok=True)
        markerFilePath = self.getMarkerValPath(marker_id, value_id, projectDir)
        # TODO check if this is available
        f = request.files['file']
        f.save(markerFilePath)
        fileRead = open(markerFilePath, encoding='utf-8')
        return fileRead.read()

    def getPathToMarkers(self, projectDir = ''):
        return PathUtils.sanitizePathList([basePath, projectDir, metaSubPath, markerPath])

    def getMarkerValPath(self, marker_id, value_id, projectDir):
        if marker_id == 'definitions':
            filename = '_writerey_marker_defs'
        else:
            filename = 'mv_' + value_id
        return PathUtils.sanitizePathList([self.getPathToMarkers(projectDir), filename])

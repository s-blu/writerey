# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import request
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath, labelPath
from pathUtils import PathUtils

import os
from stat import ST_MTIME

class Labels(Resource):
    def get(self, label_id):
        value_id = request.args.get('value_id')
        projectDir = request.args.get('project')
        try:
            labelFile = self.getLabelValPath(label_id, value_id, projectDir)
            f = open(labelFile, encoding='utf-8')
            content = f.read()

            return content
        except OSError as err:
            print('get labels failed', err)
            return ''  # TODO send an error back here

    def put(self, label_id):
        if label_id != 'definitions':
            value_id = request.form['value_id']
        else:
            value_id = ''
        projectDir = request.form['project']
        pathToLabels = self.getPathToLabels(projectDir)
        Path(pathToLabels).mkdir(parents=True, exist_ok=True)
        labelFilePath = self.getLabelValPath(label_id, value_id, projectDir)
        # TODO check if this is available
        f = request.files['file']
        f.save(labelFilePath)
        fileRead = open(labelFilePath, encoding='utf-8')
        return fileRead.read()

    def getPathToLabels(self, projectDir = ''):
        return PathUtils.sanitizePathList([basePath, projectDir, metaSubPath, labelPath])

    def getLabelValPath(self, label_id, value_id, projectDir):
        if label_id == 'definitions':
            filename = '_writerey_label_defs'
        else:
            filename = 'lv_' + value_id
        return PathUtils.sanitizePathList([self.getPathToLabels(projectDir), filename])

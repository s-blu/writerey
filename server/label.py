# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import request, abort
from flask_restful import Resource
from pathlib import Path
from writerey_config import basePath, metaSubPath, labelPath
from pathUtils import PathUtils
from logger import Logger

import os
from stat import ST_MTIME

label_def_filename = '_writerey_label_defs'
label_value_prefix = 'lv_'

class Labels(Resource):
    log = Logger('Labels')

    def get(self, label_id):
        value_id = request.args.get('value_id')
        projectDir = request.args.get('project')
        try:
            labelFile = self.getLabelValPath(label_id, value_id, projectDir)
            f = open(labelFile, encoding='utf-8')
            content = f.read()
            self.log.logDebug('returning label value content', label_id, value_id, projectDir)
            return content
        except FileNotFoundError:
            self.log.logDebug('Label Value not found, return empty string', value_id)
            return ''
        except OSError:
            self.log.logError('get labels failed with OSError')
            abort(500)

    def put(self, label_id):
        if label_id != 'definitions':
            value_id = request.form['value_id']
        else:
            value_id = ''
        projectDir = request.form['project']
        pathToLabels = self.getPathToLabels(projectDir)
        Path(pathToLabels).mkdir(parents=True, exist_ok=True)
        labelFilePath = self.getLabelValPath(label_id, value_id, projectDir)
        try:
            f = request.files['file']
        except:
            abort(400, 'No or invalid file given')
        f.save(labelFilePath)
        fileRead = open(labelFilePath, encoding='utf-8')
        return fileRead.read()

    def getPathToLabels(self, projectDir = ''):
        return PathUtils.sanitizePathList([basePath, projectDir, metaSubPath, labelPath])

    def getLabelValPath(self, label_id, value_id, projectDir):
        if label_id == 'definitions':
            filename = label_def_filename
        else:
            filename = label_value_prefix + value_id
        return PathUtils.sanitizePathList([self.getPathToLabels(projectDir), filename])

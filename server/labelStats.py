# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import os

from flask import abort, request
from flask_restful import Resource
from label import label_def_filename, label_value_prefix
from pathUtils import PathUtils
from writerey_config import basePath, labelPath, metaSubPath


class LabelStats(Resource):
    def get(self, project):
        path = PathUtils.sanitizePathList([basePath, project, metaSubPath, labelPath])
        try:
            arr = os.listdir(path)
        except:
            abort(400, 'No or invalid project given')
        # remove label def and strip file prefix from label value ids
        arr = list(filter(lambda filename: filename != label_def_filename, arr))
        arr = list(map(lambda filename: filename.replace(label_value_prefix, ''), arr))
        return arr

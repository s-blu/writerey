# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from flask import request
from flask_restful import Resource
from logger import Logger
from flask import abort


from gitUtils import GitUtils

class Tag(Resource):
    logger = Logger('Tag')
    git = GitUtils()

    def get(self):
        abort(501, 'not implemented')

    def put(self):
        tagname = request.form['tagname']
        if not tagname:
            abort(400, 'Got no tagname, nothing to tag')
        self.git.run(["git", "tag", tagname])
        return {'tagname': tagname}

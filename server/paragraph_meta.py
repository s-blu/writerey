# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import re
from pathlib import Path

from flask import Response, abort, request
from flask_restful import Resource
from logger import Logger
from pathUtils import PathUtils
from writerey_config import basePath, metaSubPath


class ParagraphMeta(Resource):
    log = Logger('ParagraphMeta')

    def get(self, doc_name):
        path = request.args.get('doc_path')
        context = request.args.get('context')
        try:
            path = PathUtils.sanitizePathList(
                [basePath, path, metaSubPath, doc_name, context])
            f = open(path, encoding='utf-8')
            content = f.read()
            return content
        except FileNotFoundError:
            self.log.logInfo('paragraph meta file not found, return empty string', context)
            return ''
        except OSError as err:
            self.log.logError('get paragraph meta failed', err)
            abort(500)

    def put(self, doc_name):
        context = request.form['context']
        if request.form['doc_path']:
            pathParts = [basePath, request.form['doc_path'], metaSubPath, doc_name]
        else:
            pathParts = [basePath, metaSubPath, doc_name]
        dirPath = PathUtils.sanitizePathList(pathParts)
        Path(dirPath).mkdir(parents=True, exist_ok=True)
        
        pathToSaveTo = PathUtils.sanitizePathList([dirPath, context])
        try:
            f = request.files['file']
            f.save(pathToSaveTo)
            savedF = open(pathToSaveTo, 'r', encoding='utf-8')
            newContent = savedF.read()
            self.saveParagraphNoteCount(dirPath, context, "notes" in newContent and not '"notes":[]' in newContent)

            return newContent
        except:
            self.log.logWarn('put paragraph meta failed')
            abort(500)

    def saveParagraphNoteCount(self, metaPath, paragraphId, isAdd):
        self.log.logDebug('saveParagraphNoteCount', paragraphId, isAdd)
        countMapPath = PathUtils.sanitizePathList([metaPath, '_paragraph_note_count'])
        file_string = ''
        # Get content of map file if existing
        try:
            file_handle =  open(countMapPath, 'r', encoding='utf-8')
            file_string = file_handle.read()
            file_handle.close()
        except:
            pass

        if paragraphId not in file_string and isAdd:
            with open(countMapPath, 'a+', encoding='utf-8') as file:
                newLine = f'{paragraphId}\n'
                file.write(newLine)
                file.close()

        if paragraphId in file_string and not isAdd:
            regex = f'({paragraphId})\n'
            file_string = re.sub(regex, '', file_string)

            # Overwrite image map file with updated content
            file_handle = open(countMapPath, 'w')
            file_handle.write(file_string)
            file_handle.close()
        return True

class ParagraphCount(Resource):
    log = Logger('ParagraphCount')

    def get(self, doc_name):
        path = request.args.get('doc_path')
        self.log.logDebug('get p count called', path, doc_name)
        try:
            path = PathUtils.sanitizePathList(
                [basePath, path, metaSubPath, doc_name, '_paragraph_note_count'])
            f = open(path, encoding='utf-8')
            content = f.read()
            return content
        except FileNotFoundError:
            self.log.logDebug('paragraph count file not found, return empty string', doc_name)
            return ''
        except OSError as err:
            self.log.logError('get paragraph meta failed', err)
            abort(500)

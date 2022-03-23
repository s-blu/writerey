import json
import os
import re
import shutil
from pathlib import Path

from flask import abort
from flask_restful import Resource
from logger import Logger
from markdownify import markdownify
from pathUtils import PathUtils
from writerey_config import basePath, labelPath, metaSubPath

exportPath = '_writerey_export'
log = Logger('markdown-converter')
file_suffix = '.md'
class MarkdownConverter(Resource):
  def get(self):
      # TODO delete existing export folder
    if Path(exportPath).exists():
        abort(400, 'Export Path already exists')
    log.logDebug('========== GET TREE FOR EXPORT =========')       
    log.logDebug('os.getcwd:', os.getcwd())
    log.logDebug('==========')

    Path(exportPath).mkdir(parents=True, exist_ok=True)
    # For each directory in the directory tree rooted at top incl self
    # dirpath is a string, the path to the directory. 
    # dirnames is a list of the names of the subdirectories in dirpath (excluding '.' and '..'). 
    # filenames is a list of the names of the non-directory files in dirpath. 
    failedFilesCounter = 0
    for (dirpath, dirnames, filenames) in os.walk(basePath):
        log.logDebug('walking ...', dirpath, dirnames, filenames)
        filePath = PathUtils.sanitizePathString(dirpath, True)

        for filename in filenames:
            if (filename.endswith('.html')):
                log.logDebug('create export file for', filePath, filename)
                failedFilesCounter = createExportFile(filePath, filename) + failedFilesCounter
            elif (metaSubPath in filePath and '.' not in filename): 
                log.logDebug('rewriting meta info for', filePath, filename)
                failedFilesCounter = rewriteMetaFileForExport(filePath, filename) + failedFilesCounter
            else: 
                log.logDebug('got invalid file, export as-is', filePath, filename)
                failedFilesCounter = duplicateFileToExportPath(filePath, filename) + failedFilesCounter

        
    log.logInfo('finished export with failed filecount:', failedFilesCounter)
    return failedFilesCounter

def createExportFolder(path, dir_name): 
    newPath = PathUtils.sanitizePathList(
            [exportPath, path, dir_name])
    Path(newPath).mkdir(parents=True, exist_ok=True)
    return PathUtils.sanitizePathString(newPath, True)

def createExportFile(path, file_name):
    try: 
        exportFilename = re.sub(r'.html', file_suffix, file_name)
        originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
        exportFilepath = PathUtils.sanitizePathList([exportPath, path, exportFilename])
        log.logDebug(f'export file for "{originalFilepath}" to "{exportFilepath}"')
        createExportFolder('', path)
        file = open(originalFilepath, "r").read()
        markdown = markdownify(file, heading_style="ATX")
        exportFile = open(exportFilepath, 'w')
        exportFile.write(markdown)

        return 0
    except BaseException as err:
        log.logError('Could not export file!!', err, originalFilepath)
        return 1

def duplicateFileToExportPath(path, file_name):
    try:
        originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
        exportFilepath = PathUtils.sanitizePathList([exportPath, path, file_name])
        createExportFolder('', path)
        log.logDebug(f'duplicate file for "{originalFilepath}" to "{exportFilepath}"')
        shutil.copyfile(originalFilepath, exportFilepath)
        return 0
    except BaseException as err:
        log.logError('Could not duplicate file!', err, originalFilepath)
        return 1

def rewriteNoteDataToFile(path, filename, data):
    exportFilepath = PathUtils.sanitizePathList([exportPath, path, filename])
    newFileContent = ''
    if 'notes' not in data:
        return 0
    for note in data['notes']:
        newFileContent = newFileContent + '\n' + markdownify(note['text'])
    createExportFolder('', path)
    file = open(exportFilepath, 'a')
    file.write(newFileContent)
    return 0

def rewriteMetaFileForExport(path, file_name):
    if file_name.startswith('lv_'):
        definitionsFile = open(PathUtils.sanitizePathList([basePath, path, '_writerey_label_defs']))
        labelValueFile = open(PathUtils.sanitizePathList([basePath, path, file_name]))
        definitions = json.load(definitionsFile)
        labelValue = json.load(labelValueFile)
        (defId, valueId) = labelValue[0]['context'].split(':')

        definition = None
        value = None
        for defi in definitions:
            if (defi['id'] == defId):
                definition = defi

        if definition:
            for val in definition['values']:
                if (val['id'] == valueId):
                    value = val
        else:
            log.logInfo('couldnt find label definition, wont save info...')
            return 0

        if value:
            newFilename = defi['name'] + '_' + value['name'] + file_suffix
        else: 
            newFilename = defi['name'] + '_' + value['id'] + file_suffix

        data = { 'notes': labelValue }
        try: 
            if (value['info']):
                data['notes'].insert(0, { 'text': value['info'] })
        except:
            log.logInfo('could not append value info, skipping', newFilename)
        return rewriteNoteDataToFile(path, newFilename, data)
    elif path.endswith('.html') and '.' not in file_name and (file_name.startswith('p') or file_name == 'document'):
        newFilename = path.split('/').pop() + '_notes' + file_suffix
        originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
        
        file = open(originalFilepath, "r")
        try:
            data = json.load(file)
            return rewriteNoteDataToFile(path, newFilename, data)
        except json.JSONDecodeError:
            log.logWarn('could not read file as json, skipping', originalFilepath)
            return 1
    elif file_name in ['_writerey_images', '_writerey_links', '_writerey_label_defs']:
        return 0
    else:
        log.logWarn('unsupported meta file!', path, file_name)
        return 1
        



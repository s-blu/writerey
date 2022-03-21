import os
import re
import shutil
from pathlib import Path

from flask_restful import Resource
from logger import Logger
from markdownify import markdownify
from pathUtils import PathUtils
from writerey_config import basePath, metaSubPath

exportPath = '_writerey_export'
log = Logger('markdown-converter')
class MarkdownConverter(Resource):
  def get(self):
    log.logDebug('========== GET TREE FOR EXPORT =========')       
    log.logDebug('os.getcwd:', os.getcwd())
    log.logDebug('==========')

    Path(exportPath).mkdir(parents=True, exist_ok=True)
    # For each directory in the directory tree rooted at top incl self
    # dirpath is a string, the path to the directory. 
    # dirnames is a list of the names of the subdirectories in dirpath (excluding '.' and '..'). 
    # filenames is a list of the names of the non-directory files in dirpath. 
    for (dirpath, dirnames, filenames) in os.walk(basePath):
        log.logDebug('walking ...', dirpath, dirnames, filenames)
        failedFilesCounter = 0;
        filePath = PathUtils.sanitizePathString(dirpath, True)

        for filename in filenames:
            if (filename.endswith('.html') or (metaSubPath in filePath and '.' not in filename)):
                log.logDebug('create export file for', filePath, filename)
                failedFilesCounter = createExportFile(filePath, filename) + failedFilesCounter
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
        exportFilename = re.sub(r'.html', '.txt', file_name)
        originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
        exportFilepath = PathUtils.sanitizePathList([exportPath, path, exportFilename])
        log.logDebug(f'export file for "{originalFilepath}" to "{exportFilepath}"')
        createExportFolder('', path)
        file = open(originalFilepath, "r").read()
        markdown = markdownify(file, heading_style="ATX")
        # log.logDebug('transformed file content into', markdown)
        # TODO strip out .html from 
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


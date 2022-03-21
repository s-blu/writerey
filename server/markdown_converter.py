import json
import os
import re
import shutil
from pathlib import Path

from flask import abort, request
from flask_restful import Resource
from logger import Logger
from markdownify import markdownify
from pathUtils import PathUtils
from tree import Tree
from writerey_config import basePath, metaSubPath

#file = open("./hello-world.html", "r").read()
#html = markdownify(file, heading_style="ATX")

#print(html)

## ## Hello, World!



exportPath = '_writerey_export'
log = Logger('markdown-converter')
class MarkdownConverter(Resource):
  def get(self):
    # ATTENTION: Tree debug is quite spammy and deactivated by default. If you want to debug it, remove the silenced=True parameter
    directoryStructure = {
        'name': '',
        'dirs': [],
        'files': []
    }
    treeBase = request.args.get('base')

    log.logDebug('========== GET TREE FOR EXPORT =========')       
    log.logDebug('os.getcwd:', os.getcwd())
    log.logDebug('base:', treeBase)
    log.logDebug('==========')

    if (treeBase and not os.path.exists(PathUtils.sanitizePathList([basePath, treeBase]))):
            abort(400, 'given treeBase is not part of the dir structure')

    # TODO create export folder parallel to the requested folder
    Path(exportPath).mkdir(parents=True, exist_ok=True)
    # For each directory in the directory tree rooted at top incl self
    # dirpath is a string, the path to the directory. 
    # dirnames is a list of the names of the subdirectories in dirpath (excluding '.' and '..'). 
    # filenames is a list of the names of the non-directory files in dirpath. 
    for (dirpath, dirnames, filenames) in os.walk(basePath):
        log.logDebug('walking ...', dirpath, dirnames, filenames)
        failedFilesCounter = 0;
        filePath = PathUtils.sanitizePathString(dirpath, True)
        path = filePath.split('/')
        for filename in filenames:
            # TODO this kills the metadata
            if (filename.endswith('.html') or (metaSubPath in filePath and '.' not in filename)):
                log.logDebug('create export file for', filePath, filename)
                failedFilesCounter = failedFilesCounter + createExportFile(filePath, filename)
            else: 
                log.logDebug('got invalid file, export as-is', filePath, filename)
                duplicateFileToExportPath(filePath, filename)

        
        # TODO for FILENAMES, put together valid path
        # TODO export each filename to the export folder
        # TODO traverse each DIRNAME
        # -> TODO create a child folder in export folder
        # -> TODO export each filename to the export folder
        # -> TODO repeat for child folders
    log.logDebug('finished export with failed filecount:', failedFilesCounter)
    return failedFilesCounter

    # TODO get files of the selected project with crawlFiles
    # TODO run through all of them and convert them to markdown
    # TODO duplicate folder structure with _markdown postfix and write markdown files to disk


def createExportFolder(path, dir_name): 
    #dir_name = PathUtils.sanitizeFilename(dir_name)
    newPath = PathUtils.sanitizePathList(
            [exportPath, path, dir_name])
    Path(newPath).mkdir(parents=True, exist_ok=True)
    return PathUtils.sanitizePathString(newPath, True)

def createExportFile(path, file_name):
    try: 
        exportFilename = re.sub(r'.html', '.txt', file_name)
        originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
        exportFilepath = PathUtils.sanitizePathList([exportPath, path, exportFilename])
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
    originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
    exportFilepath = PathUtils.sanitizePathList([exportPath, path, file_name])
    createExportFolder('', path)
    log.logDebug('duplicate file  for ... in ...', originalFilepath, exportFilepath)
    shutil.copyfile(originalFilepath, exportFilepath)

    return

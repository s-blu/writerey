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
from writerey_config import basePath, labelPath, metaSubPath

exportPath = '_writerey_export'
log = Logger('markdown-converter')

class MarkdownConverter(Resource):
  def get(self):
    file_suffix = request.args.get('filetype') or '.txt'
    if Path(exportPath).exists():
        abort(400, 'Export Path already exists')
    log.logDebug('========== GET TREE FOR EXPORT =========')       
    log.logDebug('os.getcwd:', os.getcwd())
    log.logDebug('==========')

    Path(exportPath).mkdir(parents=True, exist_ok=True)
    failedFiles = []
    for (dirpath, dirnames, filenames) in os.walk(basePath):
        filePath = PathUtils.sanitizePathString(dirpath, True)

        for filename in filenames:
            if (filename.endswith('.html')):
                failed = createExportFile(filePath, filename, file_suffix)
                if failed: 
                    failedFiles.append(failed)
            elif (metaSubPath in filePath and '.' not in filename): 
                failed = rewriteMetaFileForExport(filePath, filename, file_suffix)
                if failed: 
                    failedFiles.append(failed)
            else: 
                failed = duplicateFileToExportPath(filePath, filename)
                if failed: 
                    failedFiles.append(failed)

        
    log.logInfo('finished export with failed files:', failedFiles)
    if len(failedFiles) > 0:
        content = 'Following files could not be exported and are missing in your export folder. Please take care of these manually - sorry for the inconvience! \n'
        failedFilesFilePath = PathUtils.sanitizePathList([exportPath, '_could_not_export' + file_suffix])
        exportFile = open(failedFilesFilePath, 'w', encoding='utf-8')
        for path in failedFiles:
            content = content + '\n' + path
        exportFile.write(content)
    return failedFiles

def createExportFolder(path, dir_name): 
    newPath = PathUtils.sanitizePathList(
            [exportPath, path, dir_name])
    Path(newPath).mkdir(parents=True, exist_ok=True)
    return PathUtils.sanitizePathString(newPath, True)

def createExportFile(path, file_name, file_suffix):
    originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
    try: 
        exportFilename = re.sub(r'.html', file_suffix, file_name)
        exportFilepath = PathUtils.sanitizePathList([exportPath, path, exportFilename])
        log.logDebug(f'export file for "{originalFilepath}" to "{exportFilepath}"')
        createExportFolder('', path)
        file = open(originalFilepath, "r", encoding='utf-8', errors='ignore').read()
        markdown = markdownify(file, heading_style="ATX")
        exportFile = open(exportFilepath, 'w', encoding='utf-8')
        exportFile.write(markdown)

        return None
    except BaseException as err:
        log.logError('Could not export file!', originalFilepath, err)
        return originalFilepath

def duplicateFileToExportPath(path, file_name):
    originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
    try:
        exportFilepath = PathUtils.sanitizePathList([exportPath, path, file_name])
        createExportFolder('', path)
        log.logDebug(f'duplicate file for "{originalFilepath}" to "{exportFilepath}"')
        shutil.copyfile(originalFilepath, exportFilepath)
        return None
    except BaseException as err:
        log.logError('Could not duplicate file!', err, originalFilepath)
        return originalFilepath

def rewriteNoteDataToFile(path, filename, data):
    try: 
        exportFilepath = PathUtils.sanitizePathList([exportPath, path, filename])
        newFileContent = ''
        if 'notes' not in data:
            return None
        for note in data['notes']:
            newFileContent = newFileContent + '\n' + markdownify(note['text'])
        createExportFolder('', path)
        file = open(exportFilepath, 'a', encoding='utf-8')
        file.write(newFileContent)
        return None
    except BaseException:
        return 'failed'

def rewriteMetaFileForExport(path, file_name, file_suffix):
    originalFilepath = ''
    if file_name.startswith('lv_'):
        originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
        definitionsFile = open(PathUtils.sanitizePathList([basePath, path, '_writerey_label_defs']), encoding='utf-8', errors='ignore')
        labelValueFile = open(originalFilepath, encoding='utf-8', errors='ignore')
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
            return None

        if value:
            newFilename = defi['name'] + '_' + value['name'] + file_suffix
        else: 
            newFilename = defi['name'] + '_' + value['id'] + file_suffix

        data = { 'notes': labelValue }
        try: 
            if (value['info']):
                data['notes'].insert(0, { 'text': value['info'] })
        except:
            log.logInfo('could not find or append value info, skipping', newFilename)
        failed = rewriteNoteDataToFile(path, newFilename, data)
        return originalFilepath if failed else None
    elif path.endswith('.html') and '.' not in file_name and (file_name.startswith('p') or file_name == 'document'):
        originalFilepath = PathUtils.sanitizePathList([basePath, path, file_name])
        newFilename = path.split('/').pop() + '_notes' + file_suffix
        
        file = open(originalFilepath, "r", encoding='utf-8', errors='ignore')
        try:
            data = json.load(file)
            return rewriteNoteDataToFile(path, newFilename, data)
        except json.JSONDecodeError:
            log.logWarn('could not read file as json, skipping', originalFilepath)
            return originalFilepath
    elif file_name in ['_writerey_images', '_writerey_links', '_writerey_label_defs', 'paragraph_counter']:
        return None
    else:
        log.logWarn('unsupported meta file!', path, file_name)
        return originalFilepath
        



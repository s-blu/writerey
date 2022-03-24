# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import subprocess
import os
from pathlib import Path

from writerey_config import basePath
from pip._internal.utils.misc import get_installed_distributions
from logger import Logger

installed_packages = get_installed_distributions()
flat_installed_packages = [package.project_name for package in installed_packages]

def initialize_env(): 
  log = Logger('initialize_app')
  pip_cmd = 'pip'

  log.logDebug('checking if pip is available or fallback to pip3')
  try:
    subprocess.run([pip_cmd, '--version'], shell=True, check=True, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
  except:
    pip_cmd = 'pip3'
  
  required_packages = ['Flask', 'Flask-RESTful', 'waitress', 'markdownify']
  log.logDebug('installed packages ...', flat_installed_packages)
  for package in required_packages:
    if package not in flat_installed_packages:
      subprocess.run([pip_cmd, "install", package], shell=True, check=True, text=True)
    else:
      log.logDebug('Package is installed, do nothing... ', package)
      
  if not os.path.exists(basePath):
      Path(basePath).mkdir()

  from git import GitAutomation
  GitAutomation().init()
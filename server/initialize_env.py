# Copyright (c) 2020 s-blu
# 
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import subprocess

from pip._internal.utils.misc import get_installed_distributions
from logger import Logger

installed_packages = get_installed_distributions()
flat_installed_packages = [package.project_name for package in installed_packages]

def initialize_env(): 
  log = Logger('initialize_app')
  required_packages = ['Flask', 'Flask-RESTful', 'Flask-Cors', 'waitress']
  log.logDebug('installed packages ...', flat_installed_packages)
  for package in required_packages:
    if package not in flat_installed_packages:
      subprocess.run(["pip", "install", package], shell=True, check=True, text=True)
    else:
      log.logDebug('Package is installed, do nothing... ', package)

  from git import GitAutomation
  gitA = GitAutomation()
  gitA.init()
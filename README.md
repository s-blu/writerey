# Writerey

Writerey is a tool that wants to help you with your next writing project:  A novel, an essay for school, a research, a poem booklet, ... you name it!

It provides you a distraction free place to sort your thoughts and write down your ideas. It keeps your project safe with autosave functionality and snapshots. It provides you handy functionality to note down thoughts and side-infos. Read more about the functionality you get from writerey in its [Wiki](https://github.com/s-blu/writerey/wiki).

writerey is open source and licensed under Mozilla Public License Version 2.0. For License information see LICENSE

## System requirements

This app is only tested for Windows (8 and 10). If you use it for any other operating system, I'd appreciate feedback!

To use writerey, you need the following tools installed on your machine:

- [Python 3](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads)


## Used technologies 

Writerey is build with

- Angular 9
- node.js
- [Electron](https://www.electronjs.org/)
- [CKEditor5](https://ckeditor.com/ckeditor-5/)
- [python-shell](https://github.com/extrabacon/python-shell)


For a complete list of used packages, please refer to package.json.

## Installation

Please visit the [Wiki](https://github.com/s-blu/writerey/wiki) to find a detailed explanation how to install writerey.

- Install Python 3
- Install Git 
- Download the executable of writerey from the [Release page on Github](https://github.com/s-blu/writerey/releases/latest)
- Launch writerey.exe (on Windows)

### Build a executable for your environment
writerey is build with [electron-forge](https://www.electronforge.io/). To build a executable for your target system, do the following:

- Get the repository locally
- Install dependencies with `npm i`
- Run `npm run build-make`

If you want to build the application for a non-windows platform, please refer to [the electron-forge documentation](https://www.electronforge.io/config/makers) to configure a appropiate maker.

### Set up development

- Clone the repository
- Install JS dependencies with `npm i`
- Install Python dependencies with `pip install pipenv`, followed by `pipenv install`
- Open a terminal and start the server with `npm run flask`
- Open another terminal and start the ui with `ng serve`

Please be aware that some features (currently) don't work like expected in development environment, i.e. deletion. Since the project itself is managed by git, the sub folder is ignored to not commit test data, which leads to some conflicts when trying to commit as part of the application. To have a real test environment, please build the app as executeable.

## Guide

Please visit the [Wiki](https://github.com/s-blu/writerey/wiki) to find out more about writerey.
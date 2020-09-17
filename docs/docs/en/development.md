# Development

## Set up a development environment

Please note that you need Python 3 and Node.js (>= 12) installed on your machine.

- Clone the repository and navigate into the repository via CLI
- Install JS dependencies with `npm i`
- Install pipenv with `pip install pipenv`
- Install python dependencies with  `pipenv install`
- Open a terminal and start the server with `npm run flask`
- Open another terminal and start the ui with `ng serve` (if that is not working, use `npm run ng serve`)
- Ready! Visit `localhost:4200` to open up the app 

### Git features as part of the app

Please be aware that some features currently **don't work like expected** in development environment. Since the project itself is managed by git, the sub folder is ignored to not commit test data, which leads to some conflicts when trying to commit as part of the application. To have a real test environment, please build the app as executeable.

Nonfunctioning are currently (list is maybe incomplete):

- Deletion
- Snapshotting
- Tagging

## Build a executable for your environment
writerey is build with [electron-forge](https://www.electronforge.io/). To build a executable for your target system, do the following:

- Clone the repository and navigate into the repository via CLI
- Install JS dependencies with `npm i`
- Trigger building and packaging with `npm run build-make`

If you want to build the application for a non-windows platform, please refer to [the electron-forge documentation](https://www.electronforge.io/config/makers) to configure a appropiate maker.

## Build documentation

- Make sure to have python dependencies installed
- `cd docs/`
- `mkdocs build`

For developing the documentation, run `mkdocs serve`

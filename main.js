const { app, BrowserWindow } = require("electron");

let win;

function createWindow() {
  app.on("window-all-closed", () => {
    app.quit();
  });

  try {
    let { PythonShell } = require("python-shell");
    shell = new PythonShell(`${__dirname}/dist/writerey/server/app.py`);

    shell.on("message", function (message) {
      console.log("[Python] Log", message);
    });
    shell.on("stdout", function (message) {
      console.log("[Python] stdout", message);
    });
    shell.on("stderr", function (stderr) {
      console.error(
        "[Python] [[ERR]]",
        JSON.stringify(stderr).substring(0, 300)
      );
    });
  } catch (err) {
    console.error("Failed to launch python server", err);
    errorWindow = new BrowserWindow();

    errorWindow.loadURL(`${__dirname}/dist/writerey/assets/python_error.html`);
    errorWindow.on("closed", function () {
      errorWindow = null;
    });
    return;
  }

  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    icon: `${__dirname}/dist/writerey/assets/writerey.ico`,
    webPreferences: {
      nodeIntegration: true,
      spellcheck: true,
    },
  });

  win.loadURL(`${__dirname}/dist/writerey/index.html`);

  win.maximize();
  win.show();

  // uncomment below to open the DevTools.
  // win.webContents.openDevTools();

  // Event when the window is closed.
  win.on("closed", function () {
    shell.end();
    win = null;
  });

  const { Menu, MenuItem } = require("electron");

  win.webContents.session.setSpellCheckerLanguages([
    "en-US",
    "de-DE", // FIXME get the userlanguage here, but how? navigator.language doesnt work ...
  ]);
  win.webContents.on("context-menu", (event, params) => {
    const menu = new Menu();

    // Add each spelling suggestion
    for (const suggestion of params.dictionarySuggestions) {
      menu.append(
        new MenuItem({
          label: suggestion,
          click: () => win.webContents.replaceMisspelling(suggestion),
        })
      );
    }

    // Allow users to add the misspelled word to the dictionary
    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: "Add to dictionary",
          click: () =>
            win.webContents.session.addWordToSpellCheckerDictionary(
              params.misspelledWord
            ),
        })
      );
    }

    menu.popup();
  });
}

// Create window on electron intialization
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});

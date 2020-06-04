const { app, BrowserWindow } = require("electron");

let win;
const PATH_TO_APP = `${__dirname}/dist/writerey`;

function createWindow() {
  app.on("window-all-closed", () => {
    app.quit();
  });

  try {
    let {
      PythonShell,
    } = require(`${PATH_TO_APP}/assets/thirdparty/python-shell`);
    shell = new PythonShell(`${PATH_TO_APP}/server/app.py`, {
      pythonOptions: ["-u"],
      parser: function (message) {
        if (!message) return;
        console.log("[Py] Log", message);
      },
      stderrParser: function (stderr) {
          if (!stderr) return;
          console.error(
            "[Py] [[ERR]]",
            (JSON.stringify(stderr) || "").substring(0, 300)
          );
      }
    });

    shell.on("close", function (message) {
      if (!message) return;
      console.log("[Python] [CLOSED]", message);
    });;
    shell.on("stdout", function (message) {
      if (!message) return;
      console.log("[Python] stdout", message);
    });
  } catch (err) {
    console.error("Failed to launch python server", err);
    errorWindow = new BrowserWindow();

    errorWindow.loadURL(`${PATH_TO_APP}/assets/python_error.html`);
    errorWindow.on("closed", function () {
      errorWindow = null;
    });
    return;
  }

  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    icon: `${PATH_TO_APP}/assets/writerey.ico`,
    webPreferences: {
      nodeIntegration: true,
      spellcheck: true,
    },
  });

  win.loadURL(`${PATH_TO_APP}/index.html`);

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

const { app, BrowserWindow } = require("electron");

let win;

function createWindow() {
  let { PythonShell } = require("python-shell");
  shell = new PythonShell(`${__dirname}/dist/writerey/server/app.py`, {
    args: [__dirname],
  });

  shell.on("message", function (message) {
    console.log("[Python] Log", message);
  });
  shell.on("stdout", function (message) {
    console.log("[Python] stdout", message);
  });
  shell.on("stderr", function (stderr) {
    console.error("[Python] [[ERR]]", JSON.stringify(stderr).substring(0, 300));
  });

  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    icon: `file://${__dirname}/dist/writerey/assets/logo.png`,
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

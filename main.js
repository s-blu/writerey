const { app, BrowserWindow } = require("electron");

let win;
const PATH_TO_APP = `${__dirname}/dist/writerey`;

function createWindow() {
  app.on("window-all-closed", () => {
    app.quit();
  });

  const isBackendRunning = startupPythonBackend();

  if (!isBackendRunning) {
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

  // Open windows in default Browser
  openUrlsInDefaultBrowser();

  // Enable spellchecking
  enableSpellChecking();
}

// Create window on electron intialization
app.on("ready", createWindow);

// macOS specific processes
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", function () {
  if (win === null) {
    createWindow();
  }
});

/**
 * Startup python backend in python shell
 */
function startupPythonBackend() {
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
      },
    });

    shell.on("close", function (message) {
      if (!message) return;
      console.log("[Python] [CLOSED]", message);
    });
    shell.on("stdout", function (message) {
      if (!message) return;
      console.log("[Python] stdout", message);
    });

    return true;
  } catch (err) {
    console.error("Failed to launch python server", err);
    return false;
  }
}

/**
 * Opens URLs in the default browser instead of the electron instance
 */
function openUrlsInDefaultBrowser() {
  const handleRedirect = (e, url) => {
    if (url != win.webContents.getURL()) {
      e.preventDefault();
      require("electron").shell.openExternal(url);
    }
  };

  win.webContents.on("will-navigate", handleRedirect);
  win.webContents.on("new-window", handleRedirect);
}

/**
 * Enables chrome integrated spell checking and shows corrections in context menu
 */
function enableSpellChecking() {
  const { Menu, MenuItem } = require("electron");

  // FIXME get the userlanguage here, but how? navigator.language doesnt work ...
  win.webContents.session.setSpellCheckerLanguages(["en-US", "de-DE"]);
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

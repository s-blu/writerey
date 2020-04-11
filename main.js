const { app, BrowserWindow } = require("electron");

let win;

function createWindow() {
  let { PythonShell } = require("python-shell");

  shell = PythonShell.run(
    `${__dirname}/dist/writerey/server/app.py`,
    null,
    function (err) {
      if (err) throw err;
      console.log("app.py finished");
    }
  );
  shell.on("message", function (message) {
    console.log("[Python] Log", message);
  });
  shell.on("stdout", function (message) {
    console.log("[Python] stdout", message);
  });
  shell.on("stderr", function (stderr) {
    console.error("[Python] [[ERR]]", stderr);
  });

  // Create the browser window.
  win = new BrowserWindow({
    width: 1680,
    height: 1050,
    icon: `file://${__dirname}/dist/assets/logo.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(`${__dirname}/dist/writerey/index.html`);

  // uncomment below to open the DevTools.
  // win.webContents.openDevTools();

  // Event when the window is closed.
  win.on("closed", function () {
    win = null;
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

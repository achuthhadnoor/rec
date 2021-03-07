const { app, BrowserWindow, Tray, Menu, globalShortcut, screen, ipcMain } = require("electron");
const { platform } = require("os");
const { join } = require("path");
const isDev = require("electron-is-dev"); 
const log = require("electron-log");
const { onFirstRunMaybe } = require('./first-run')

app.setAppUserModelId("com.captur.uiuxdx");

app.on("ready", async () => {
  await onFirstRunMaybe() 
  createTray();
  createBrowserWindow();


  if (!isDev) {
    checkForUpdates();
    registerGlobalShortcuts();
  }
});


const createTray = () => {
  tray = new Tray(join(__dirname, '/static/logo.ico'));
  tray.setToolTip("SnipNote,Organize your day with notes and checklist ");
  tray.on("click", () => toggleWindow())
};


function toggleWindow() {
  if (trayWindow.isVisible()) {
    trayWindow.hide();
    if (process.platform === "darwin") {
      //app.dock.hide();
      trayWindow.setSkipTaskbar(true);
    }
  } else {
    trayWindow.show();
    if (process.platform === "darwin") {
      app.dock.show();
      trayWindow.setSkipTaskbar(true);
    }
  }
}

function createBrowserWindow() {
  console.log(screen);
  const currentDisplay = screen.getPrimaryDisplay();

    trayWindow = new BrowserWindow({
      y:60,
      x:currentDisplay.workAreaSize.width - 400,
      height:80,
      width:150,
      resizable: false,
      movable: true,
      fullscreenable:false,
      fullscreen:false,
      alwaysOnTop: true,
      show: false,
      skipTaskbar: true,
      frame: false,//platform() !== "win32",
      titleBarStyle: "inset", //"hidden",
      icon: join(__dirname, "main/static/logo.ico"),
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        preload: join(__dirname, 'preload.js'),
      },
    });  
  const devPath = join(__dirname,"../renderer/index.html");
  console.log(devPath);
  if (isDev) {
    trayWindow.loadURL(devPath);
    trayWindow.webContents.openDevTools();
  } else {
    // PRODUCTION Load the nextjs build
    trayWindow.loadURL(
      url.format({
        pathname: resolve("renderer/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }
  trayWindow.setSkipTaskbar(true, { forward: 'true' })
  trayWindow.on("ready-to-show", () => {
    trayWindow.show();
    if (app.dock) app.dock.hide();
    if (trayWindow.setSkipTaskbar) {
      trayWindow.setSkipTaskbar(true)
    }
  });

  if (platform() !== "win32") {
    autoUpdater();
  }

}
 

function registerGlobalShortcuts() {
  // Global Shortcut : Toggle Window
  const shortcutToggleWindow = globalShortcut.register("Super+Alt+Up", () => {
    toggleWindow();
  });
  const shortcutToggleState = globalShortcut.register("Super+Alt+Down", () => {
    toggleWindow();
  });
  if (!shortcutToggleState) {
    log.warn("Unable to register:CommandOrControl+Down");
  }
}
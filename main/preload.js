const { ipcRenderer, remote } = require('electron')
const { writeJSON, readJson } = require("fs-extra");
const { homedir } = require("os");
window.remote = remote;
window.writeJSON = writeJSON;
window.readJson = readJson;
window.homedir = homedir;
window.isElectron = require('is-electron');
// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
window.ipcRenderer = ipcRenderer
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer
})

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // File system operations
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  loadData: () => ipcRenderer.invoke('load-data'),
  printToPDF: (options) => ipcRenderer.invoke('print-to-pdf', options),
  
  // App info
  getAppInfo: () => ({
    isElectron: true,
    platform: process.platform,
    version: process.env.npm_package_version
  })
});

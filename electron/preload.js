
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // File system operations
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  loadData: () => ipcRenderer.invoke('load-data'),
  printToPDF: (options) => ipcRenderer.invoke('print-to-pdf', options),
  
  // Database operations
  db: {
    query: (query, params) => ipcRenderer.invoke('db-query', { query, params }),
    update: (query, params) => ipcRenderer.invoke('db-update', { query, params }),
    getTableData: (tableName) => ipcRenderer.invoke('db-get-table', tableName),
    backup: () => ipcRenderer.invoke('db-backup'),
    restore: () => ipcRenderer.invoke('db-restore')
  },
  
  // Event handling
  onShowBackupReminder: (callback) => {
    ipcRenderer.on('show-backup-reminder', (_, ...args) => callback(...args));
  },
  removeShowBackupReminder: (callback) => {
    ipcRenderer.removeListener('show-backup-reminder', callback);
  },
  
  // App info
  getAppInfo: () => {
    return {
      isElectron: true,
      platform: process.platform,
      version: process.env.npm_package_version || '1.0.0',
      dbPath: ipcRenderer.invoke('get-db-path')
    };
  }
});

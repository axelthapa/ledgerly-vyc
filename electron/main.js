const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "VYC Accounting System",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (isDev) {
    // Development - load from dev server
    mainWindow.loadURL('http://localhost:8080');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // Production - load built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, re-create window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for file system operations
ipcMain.handle('save-data', async (event, { fileName, data }) => {
  try {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: fileName,
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { success: true, filePath };
    }
    return { success: false, error: 'Operation cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-data', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (filePaths && filePaths.length > 0) {
      const data = JSON.parse(fs.readFileSync(filePaths[0], 'utf-8'));
      return { success: true, data };
    }
    return { success: false, error: 'Operation cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('print-to-pdf', async (event, options) => {
  try {
    const data = await mainWindow.webContents.printToPDF(options);
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: 'document.pdf',
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    });
    
    if (filePath) {
      fs.writeFileSync(filePath, data);
      return { success: true, filePath };
    }
    return { success: false, error: 'Operation cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

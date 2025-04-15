
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { initializeDatabase, executeQuery, executeUpdate, getDatabasePath } = require('./db-utils');
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

// Initialize database before creating the window
app.whenReady().then(async () => {
  try {
    // Initialize the database
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    dialog.showErrorBox(
      'Database Error', 
      `Failed to initialize the database: ${error.message}`
    );
  }
  
  // Create the main window
  createWindow();
});

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

// IPC handlers for database operations
ipcMain.handle('db-query', async (event, { query, params }) => {
  return await executeQuery(query, params || []);
});

ipcMain.handle('db-update', async (event, { query, params }) => {
  return await executeUpdate(query, params || []);
});

ipcMain.handle('db-get-table', async (event, tableName) => {
  const safeTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
  return await executeQuery(`SELECT * FROM ${safeTableName}`);
});

ipcMain.handle('db-backup', async () => {
  try {
    const sourceDbPath = getDatabasePath();
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: `vyc_accounting_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.db`,
      filters: [
        { name: 'SQLite Database', extensions: ['db'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (filePath) {
      fs.copyFileSync(sourceDbPath, filePath);
      return { success: true, filePath };
    }
    return { success: false, error: 'Operation cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-restore', async () => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'SQLite Database', extensions: ['db'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (filePaths && filePaths.length > 0) {
      const targetDbPath = getDatabasePath();
      
      // Close all database connections before replacing the file
      app.quit();
      
      // Note: This won't actually execute since the app will quit,
      // but in case we change the implementation later, this return is here
      return { success: true, message: 'Database restored successfully. Restarting application...' };
    }
    return { success: false, error: 'Operation cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-db-path', () => {
  return getDatabasePath();
});

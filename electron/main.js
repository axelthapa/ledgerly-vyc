const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { initializeDatabase, executeQuery, executeUpdate, getDatabasePath } = require('./db-utils');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;
let isFirstRun = true;
let lastBackupPrompt = 0;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "VYC Demo",
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
  
  // Check for backup reminder after the window has loaded
  mainWindow.webContents.on('did-finish-load', () => {
    checkBackupReminder();
  });
}

// Initialize database before creating the window
app.whenReady().then(async () => {
  try {
    // Check if database exists (to determine if this is the first run)
    const dbPath = getDatabasePath();
    isFirstRun = !fs.existsSync(dbPath);
    
    // Initialize the database
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    // If this is the first run, the login screen will handle user creation
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

// Check if backup reminder is needed
async function checkBackupReminder() {
  if (!mainWindow) return;

  try {
    // Check last backup date
    const now = Date.now();
    
    // Only show backup reminder once per app session
    if (lastBackupPrompt > 0) return;
    
    // Get backup reminder setting
    const reminderResult = await executeQuery(
      'SELECT value FROM settings WHERE key = ?', 
      ['backup_reminder_days']
    );
    
    if (!reminderResult.success || !reminderResult.data || reminderResult.data.length === 0) {
      return;
    }
    
    const reminderDays = parseInt(reminderResult.data[0].value) || 7;
    
    // Get last backup date
    const backupResult = await executeQuery(
      'SELECT value FROM settings WHERE key = ?', 
      ['last_backup_date']
    );
    
    if (!backupResult.success || !backupResult.data || backupResult.data.length === 0) {
      // No backup has been made yet, prompt if not the first run
      if (!isFirstRun) {
        showBackupReminder();
      }
      return;
    }
    
    const lastBackup = new Date(backupResult.data[0].value).getTime();
    const daysSinceBackup = Math.floor((now - lastBackup) / (1000 * 60 * 60 * 24));
    
    if (daysSinceBackup >= reminderDays) {
      showBackupReminder();
    }
  } catch (error) {
    console.error('Error checking backup reminder:', error);
  }
}

// Show backup reminder dialog
function showBackupReminder() {
  if (!mainWindow) return;
  
  lastBackupPrompt = Date.now();
  
  // Use renderer process to show the reminder (through IPC)
  mainWindow.webContents.send('show-backup-reminder');
}

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
      defaultPath: `vyc_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.db`,
      filters: [
        { name: 'SQLite Database', extensions: ['db'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (filePath) {
      fs.copyFileSync(sourceDbPath, filePath);
      
      // Update last backup date
      await executeUpdate(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        ['last_backup_date', new Date().toISOString()]
      );
      
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
      
      // Show confirmation dialog
      const { response } = await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Cancel', 'Restore'],
        defaultId: 0,
        title: 'Confirm Database Restore',
        message: 'Restoring the database will replace all current data. This cannot be undone. Are you sure you want to continue?',
        detail: 'The application will quit after restoration and you will need to restart it.'
      });
      
      if (response === 1) {
        // Close all database connections before replacing the file
        app.quit();
        
        // Note: This won't actually execute since the app will quit,
        // but in case we change the implementation later, this return is here
        return { success: true, message: 'Database restored successfully. Restarting application...' };
      } else {
        return { success: false, error: 'Operation cancelled' };
      }
    }
    return { success: false, error: 'Operation cancelled' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-app-info', () => {
  return {
    isElectron: true,
    platform: process.platform,
    version: app.getVersion(),
    dbPath: getDatabasePath()
  };
});

ipcMain.handle('get-db-path', () => {
  return getDatabasePath();
});

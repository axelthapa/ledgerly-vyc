
/**
 * Utility functions for interacting with Electron APIs
 */

// Check if we're running in Electron
export function isElectron() {
  return window.electron !== undefined;
}

// Get app info
export function getAppInfo() {
  if (!isElectron()) {
    console.warn('getAppInfo is only available in Electron');
    return {
      isElectron: false,
      platform: 'web',
      version: '1.0.0-dev',
      dbPath: null
    };
  }
  return window.electron.getAppInfo();
}

// File operations
export async function saveData(data: any) {
  if (!isElectron()) {
    console.warn('saveData is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.saveData(data);
}

export async function loadData() {
  if (!isElectron()) {
    console.warn('loadData is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.loadData();
}

export async function printToPDF(options: any) {
  if (!isElectron()) {
    console.warn('printToPDF is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.printToPDF(options);
}

// These are the missing functions needed by ElectronFeatures.tsx and Backup.tsx
export async function saveDataToFile(fileName: string, data: any): Promise<{ success: boolean; filePath?: string; error?: string }> {
  if (!isElectron()) {
    console.warn('saveDataToFile is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.saveData({ fileName, data });
}

export async function loadDataFromFile(): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isElectron()) {
    console.warn('loadDataFromFile is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.loadData();
}

export async function backupDatabase(): Promise<{ success: boolean; filePath?: string; error?: string; message?: string }> {
  if (!isElectron()) {
    console.warn('backupDatabase is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.db.backup();
}

export async function restoreDatabase(): Promise<{ success: boolean; error?: string; message?: string }> {
  if (!isElectron()) {
    console.warn('restoreDatabase is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.db.restore();
}

// Database operations
export async function dbQuery(query: string, params: any[] = []) {
  if (!isElectron()) {
    console.warn('dbQuery is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // For debugging
    console.log('Running query:', query, 'with params:', params);
    
    const result = await window.electron.db.query(query, params);
    
    // For debugging
    console.log('Query result:', result);
    
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

export async function dbUpdate(query: string, params: any[] = []) {
  if (!isElectron()) {
    console.warn('dbUpdate is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // For debugging
    console.log('Running update:', query, 'with params:', params);
    
    const result = await window.electron.db.update(query, params);
    
    // For debugging
    console.log('Update result:', result);
    
    return result;
  } catch (error) {
    console.error('Database update error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

export async function getTableData(tableName: string) {
  if (!isElectron()) {
    console.warn('getTableData is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.db.getTableData(tableName);
}

export async function dbBackup() {
  if (!isElectron()) {
    console.warn('dbBackup is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.db.backup();
}

export async function dbRestore() {
  if (!isElectron()) {
    console.warn('dbRestore is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.db.restore();
}

// Debug logging
export function logDebug(message: string) {
  if (!isElectron()) {
    console.warn('logDebug is only available in Electron');
    console.log('[Debug]', message);
    return;
  }
  return window.electron.logDebug(message);
}

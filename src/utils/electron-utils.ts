
import { toast } from '@/components/ui/toast-utils';
import { DbResult } from './db-operations';

export function isElectron() {
  return typeof window !== 'undefined' && Boolean(window.electron);
}

export function getAppInfo() {
  if (!isElectron()) {
    console.warn('getAppInfo is only available in Electron');
    return {
      isElectron: false,
      platform: 'web',
      version: '1.0.0',
      dbPath: null
    };
  }
  
  return window.electron?.getAppInfo();
}

export async function dbQuery(query: string, params: any[] = []): Promise<DbResult<any>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await window.electron?.db?.query(query, params);
    return result || { success: false, error: 'Database operation failed' };
  } catch (error) {
    console.error('DB query error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

export async function dbUpdate(query: string, params: any[] = []): Promise<DbResult<any>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await window.electron?.db?.update(query, params);
    return result || { success: false, error: 'Database operation failed' };
  } catch (error) {
    console.error('DB update error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// Get table data
export async function getTableData(tableName: string): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await window.electron?.db?.getTableData(tableName);
    return result || { success: false, error: `Failed to get data from ${tableName}` };
  } catch (error) {
    console.error(`Error getting data from ${tableName}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// Backup database
export async function backupDatabase(): Promise<DbResult<string>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await window.electron?.db?.backup();
    return result || { success: false, error: 'Backup operation failed' };
  } catch (error) {
    console.error('Database backup error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}

// Restore database
export async function restoreDatabase(): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await window.electron?.db?.restore();
    return result || { success: false, error: 'Restore operation failed' };
  } catch (error) {
    console.error('Database restore error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

// Save data to file
export async function saveData(data: any): Promise<{ success: boolean; filePath?: string; error?: string }> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await window.electron?.saveData(data);
    return result || { success: false, error: 'Save operation failed' };
  } catch (error) {
    console.error('Save data error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Load data from file
export async function loadData(): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await window.electron?.loadData();
    return result || { success: false, error: 'Load operation failed' };
  } catch (error) {
    console.error('Load data error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Print to PDF
export async function printToPDF(options: any = {}): Promise<{ success: boolean; filePath?: string; error?: string }> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await window.electron?.printToPDF(options);
    return result || { success: false, error: 'Print operation failed' };
  } catch (error) {
    console.error('Print to PDF error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Debug logging
export function logDebug(message: string): void {
  if (isElectron()) {
    window.electron?.logDebug(message);
  } else {
    console.debug('[Debug]', message);
  }
}

// Add event listeners for backup reminders
export function onShowBackupReminder(callback: () => void) {
  if (isElectron() && window.electron?.onShowBackupReminder) {
    window.electron.onShowBackupReminder(callback);
  }
}

// Remove event listeners for backup reminders
export function removeShowBackupReminder(callback: () => void) {
  if (isElectron() && window.electron?.removeShowBackupReminder) {
    window.electron.removeShowBackupReminder(callback);
  }
}


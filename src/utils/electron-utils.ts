
/**
 * Utility functions for Electron integration
 */

// Check if running in Electron
export const isElectron = (): boolean => {
  // @ts-ignore - electron property will be available when running in Electron
  return window.electron !== undefined;
};

// Save data to file system (JSON)
export const saveDataToFile = async (fileName: string, data: any): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  if (!isElectron()) {
    console.warn('saveDataToFile is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // @ts-ignore - electron property exists in Electron environment
    return await window.electron.saveData({ fileName, data });
  } catch (error) {
    console.error('Failed to save data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

// Load data from file system (JSON)
export const loadDataFromFile = async (): Promise<{ success: boolean; data?: any; error?: string }> => {
  if (!isElectron()) {
    console.warn('loadDataFromFile is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // @ts-ignore - electron property exists in Electron environment
    return await window.electron.loadData();
  } catch (error) {
    console.error('Failed to load data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

// Print content to PDF
export const printToPDF = async (options?: any): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  if (!isElectron()) {
    console.warn('printToPDF is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // @ts-ignore - electron property exists in Electron environment
    return await window.electron.printToPDF(options || {});
  } catch (error) {
    console.error('Failed to print to PDF:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

// Database operations
export const dbQuery = async (query: string, params: any[] = []): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  if (!isElectron()) {
    console.warn('dbQuery is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // @ts-ignore - electron property exists in Electron environment
    return await window.electron.db.query(query, params);
  } catch (error) {
    console.error('Failed to execute query:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

export const dbUpdate = async (query: string, params: any[] = []): Promise<{ success: boolean; changes?: number; lastInsertRowid?: number; error?: string }> => {
  if (!isElectron()) {
    console.warn('dbUpdate is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // @ts-ignore - electron property exists in Electron environment
    return await window.electron.db.update(query, params);
  } catch (error) {
    console.error('Failed to execute update:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

export const getTableData = async (tableName: string): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  if (!isElectron()) {
    console.warn('getTableData is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // @ts-ignore - electron property exists in Electron environment
    return await window.electron.db.getTableData(tableName);
  } catch (error) {
    console.error('Failed to get table data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

export const backupDatabase = async (): Promise<{ success: boolean; filePath?: string; error?: string }> => {
  if (!isElectron()) {
    console.warn('backupDatabase is only available in Electron');
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // @ts-ignore - electron property exists in Electron environment
    return await window.electron.db.backup();
  } catch (error) {
    console.error('Failed to backup database:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

// Get app information (platform, version)
export const getAppInfo = (): { isElectron: boolean; platform?: string; version?: string; dbPath?: string } => {
  if (!isElectron()) {
    return { isElectron: false };
  }
  
  try {
    // @ts-ignore - electron property exists in Electron environment
    return window.electron.getAppInfo();
  } catch (error) {
    console.error('Failed to get app info:', error);
    return { isElectron: true };
  }
};

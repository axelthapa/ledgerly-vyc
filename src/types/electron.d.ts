
interface DbResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  changes?: number;
  lastInsertRowid?: number;
}

interface ElectronAPI {
  // File system operations
  saveData: (data: any) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  loadData: () => Promise<{ success: boolean; data?: any; error?: string }>;
  printToPDF: (options: any) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  
  // Database operations
  db?: {
    query: (query: string, params?: any[]) => Promise<DbResult>;
    update: (query: string, params?: any[]) => Promise<DbResult>;
    getTableData: (tableName: string) => Promise<DbResult>;
    backup: () => Promise<DbResult>;
    restore: () => Promise<DbResult>;
  };
  
  // Event handling
  onShowBackupReminder?: (callback: () => void) => void;
  removeShowBackupReminder?: (callback: () => void) => void;
  
  // App info
  getAppInfo: () => {
    isElectron: boolean;
    platform: string;
    version: string;
    dbPath: string;
  };
}

interface Window {
  electron?: ElectronAPI;
}

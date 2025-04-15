
interface ElectronAPI {
  saveData: (data: { fileName: string; data: any }) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  loadData: () => Promise<{ success: boolean; data?: any; error?: string }>;
  printToPDF: (options?: any) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  db: {
    query: (query: string, params?: any[]) => Promise<{ success: boolean; data?: any[]; error?: string }>;
    update: (query: string, params?: any[]) => Promise<{ success: boolean; changes?: number; lastInsertRowid?: number; error?: string }>;
    getTableData: (tableName: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
    backup: () => Promise<{ success: boolean; filePath?: string; error?: string }>;
  };
  getAppInfo: () => { isElectron: boolean; platform: string; version: string; dbPath?: string };
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};

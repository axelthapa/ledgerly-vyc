
interface ElectronAPI {
  saveData: (data: { fileName: string; data: any }) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  loadData: () => Promise<{ success: boolean; data?: any; error?: string }>;
  printToPDF: (options?: any) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  getAppInfo: () => { isElectron: boolean; platform: string; version: string };
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};

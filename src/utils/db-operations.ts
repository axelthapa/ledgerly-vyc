
import { dbQuery, dbUpdate, isElectron } from './electron-utils';
import { toast } from '@/components/ui/toast-utils';

// Generic interface for database operations
export interface DbResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Get settings
export async function getSetting(key: string): Promise<DbResult<string>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery(
      'SELECT value FROM settings WHERE key = ?',
      [key]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    if (result.data && result.data.length > 0) {
      return { success: true, data: result.data[0].value };
    }
    
    return { success: false, error: `Setting '${key}' not found` };
  } catch (error) {
    console.error('Error getting setting:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Update setting
export async function updateSetting(key: string, value: string): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbUpdate(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [key, value]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating setting:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get all settings
export async function getAllSettings(): Promise<DbResult<Record<string, string>>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery('SELECT key, value FROM settings');
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    const settings: Record<string, string> = {};
    
    if (result.data) {
      result.data.forEach((row: { key: string; value: string }) => {
        settings[row.key] = row.value;
      });
    }
    
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error getting settings:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Function to log activity
export async function logActivity(action: string, entityType?: string, entityId?: string, details?: string): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbUpdate(
      'INSERT INTO activity_log (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)',
      [action, entityType || null, entityId || null, details || null]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error logging activity:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get recent activities
export async function getRecentActivities(limit: number = 10): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery(
      'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

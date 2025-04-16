
import { dbQuery, dbUpdate, isElectron } from './electron-utils';
import { toast } from '@/components/ui/toast-utils';
import { formatDate } from './nepali-date';
import { DbResult } from './db-operations';

export interface Supplier {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  pan?: string;
  credit_days: number;
  opening_balance: number;
  balance_type: 'CR' | 'DR';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Get all suppliers
export async function getAllSuppliers(): Promise<DbResult<Supplier[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery('SELECT * FROM suppliers ORDER BY name');
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error getting suppliers:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get supplier by ID
export async function getSupplierById(id: string): Promise<DbResult<Supplier>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    if (result.data && result.data.length > 0) {
      return { success: true, data: result.data[0] };
    }
    
    return { success: false, error: `Supplier with ID '${id}' not found` };
  } catch (error) {
    console.error('Error getting supplier:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Create new supplier
export async function createSupplier(supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<DbResult<string>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Generate next supplier ID
    const idResult = await dbQuery(
      "SELECT id FROM suppliers ORDER BY id DESC LIMIT 1"
    );
    
    let nextId = 'SP001';
    
    if (idResult.success && idResult.data && idResult.data.length > 0) {
      const lastId = idResult.data[0].id;
      const idNumber = parseInt(lastId.substring(2), 10);
      nextId = `SP${(idNumber + 1).toString().padStart(3, '0')}`;
    }
    
    const result = await dbUpdate(
      `INSERT INTO suppliers (
        id, name, address, phone, email, pan, credit_days, 
        opening_balance, balance_type, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextId,
        supplier.name,
        supplier.address || '',
        supplier.phone || '',
        supplier.email || '',
        supplier.pan || '',
        supplier.credit_days || 0,
        supplier.opening_balance || 0,
        supplier.balance_type || 'CR',
        supplier.notes || ''
      ]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: nextId, message: 'Supplier created successfully' };
  } catch (error) {
    console.error('Error creating supplier:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Update supplier
export async function updateSupplier(id: string, supplier: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Build the update query dynamically based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    
    if (supplier.name !== undefined) {
      fields.push('name = ?');
      values.push(supplier.name);
    }
    
    if (supplier.address !== undefined) {
      fields.push('address = ?');
      values.push(supplier.address);
    }
    
    if (supplier.phone !== undefined) {
      fields.push('phone = ?');
      values.push(supplier.phone);
    }
    
    if (supplier.email !== undefined) {
      fields.push('email = ?');
      values.push(supplier.email);
    }
    
    if (supplier.pan !== undefined) {
      fields.push('pan = ?');
      values.push(supplier.pan);
    }
    
    if (supplier.credit_days !== undefined) {
      fields.push('credit_days = ?');
      values.push(supplier.credit_days);
    }
    
    if (supplier.opening_balance !== undefined) {
      fields.push('opening_balance = ?');
      values.push(supplier.opening_balance);
    }
    
    if (supplier.balance_type !== undefined) {
      fields.push('balance_type = ?');
      values.push(supplier.balance_type);
    }
    
    if (supplier.notes !== undefined) {
      fields.push('notes = ?');
      values.push(supplier.notes);
    }
    
    if (fields.length === 0) {
      return { success: true, message: 'No changes to update' };
    }
    
    // Add ID to values
    values.push(id);
    
    const query = `UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await dbUpdate(query, values);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, message: 'Supplier updated successfully' };
  } catch (error) {
    console.error('Error updating supplier:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Delete supplier
export async function deleteSupplier(id: string): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Check if supplier has transactions
    const transactionsResult = await dbQuery(
      'SELECT COUNT(*) as count FROM transactions WHERE party_type = ? AND party_id = ?',
      ['supplier', id]
    );
    
    if (transactionsResult.success && transactionsResult.data && transactionsResult.data[0].count > 0) {
      return { 
        success: false, 
        error: 'Cannot delete supplier with existing transactions. Please archive instead.' 
      };
    }
    
    const result = await dbUpdate(
      'DELETE FROM suppliers WHERE id = ?',
      [id]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, message: 'Supplier deleted successfully' };
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get supplier pending payments
export async function getSupplierPendingPayments(supplierId: string): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery(
      `SELECT id, date, reference, total_amount, payment_date, due_date, status
       FROM transactions
       WHERE party_type = 'supplier' AND party_id = ? AND status IN ('pending', 'partial')
       ORDER BY date`,
      [supplierId]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error getting supplier pending payments:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get upcoming payment due to suppliers
export async function getSupplierPaymentDue(): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Get transactions with upcoming due dates (within 7 days)
    const today = formatDate(new Date());
    const result = await dbQuery(
      `SELECT t.id, t.date, t.reference, t.total_amount, t.payment_date, t.due_date, t.status,
              s.id as supplier_id, s.name as supplier_name, s.credit_days
       FROM transactions t
       JOIN suppliers s ON t.party_id = s.id
       WHERE t.party_type = 'supplier' 
         AND t.status IN ('pending', 'partial')
         AND t.due_date IS NOT NULL
         AND t.due_date <= date(?, '+7 days')
       ORDER BY t.due_date`,
      [today]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error getting supplier payment dues:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

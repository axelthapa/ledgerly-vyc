
import { dbQuery, dbUpdate, isElectron } from './electron-utils';
import { toast } from '@/components/ui/toast-utils';
import { formatDate, parseNepaliDate } from './nepali-date';
import { DbResult } from './db-operations';

export interface Customer {
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

// Get all customers
export async function getAllCustomers(): Promise<DbResult<Customer[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery('SELECT * FROM customers ORDER BY name');
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error getting customers:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get customer by ID
export async function getCustomerById(id: string): Promise<DbResult<Customer>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    if (result.data && result.data.length > 0) {
      return { success: true, data: result.data[0] };
    }
    
    return { success: false, error: `Customer with ID '${id}' not found` };
  } catch (error) {
    console.error('Error getting customer:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Create new customer
export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<DbResult<string>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Generate next customer ID
    const idResult = await dbQuery(
      "SELECT id FROM customers ORDER BY id DESC LIMIT 1"
    );
    
    let nextId = 'CN001';
    
    if (idResult.success && idResult.data && idResult.data.length > 0) {
      const lastId = idResult.data[0].id;
      const idNumber = parseInt(lastId.substring(2), 10);
      nextId = `CN${(idNumber + 1).toString().padStart(3, '0')}`;
    }
    
    const result = await dbUpdate(
      `INSERT INTO customers (
        id, name, address, phone, email, pan, credit_days, 
        opening_balance, balance_type, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextId,
        customer.name,
        customer.address || '',
        customer.phone || '',
        customer.email || '',
        customer.pan || '',
        customer.credit_days || 0,
        customer.opening_balance || 0,
        customer.balance_type || 'CR',
        customer.notes || ''
      ]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: nextId, message: 'Customer created successfully' };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Update customer
export async function updateCustomer(id: string, customer: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Build the update query dynamically based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    
    if (customer.name !== undefined) {
      fields.push('name = ?');
      values.push(customer.name);
    }
    
    if (customer.address !== undefined) {
      fields.push('address = ?');
      values.push(customer.address);
    }
    
    if (customer.phone !== undefined) {
      fields.push('phone = ?');
      values.push(customer.phone);
    }
    
    if (customer.email !== undefined) {
      fields.push('email = ?');
      values.push(customer.email);
    }
    
    if (customer.pan !== undefined) {
      fields.push('pan = ?');
      values.push(customer.pan);
    }
    
    if (customer.credit_days !== undefined) {
      fields.push('credit_days = ?');
      values.push(customer.credit_days);
    }
    
    if (customer.opening_balance !== undefined) {
      fields.push('opening_balance = ?');
      values.push(customer.opening_balance);
    }
    
    if (customer.balance_type !== undefined) {
      fields.push('balance_type = ?');
      values.push(customer.balance_type);
    }
    
    if (customer.notes !== undefined) {
      fields.push('notes = ?');
      values.push(customer.notes);
    }
    
    if (fields.length === 0) {
      return { success: true, message: 'No changes to update' };
    }
    
    // Add ID to values
    values.push(id);
    
    const query = `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await dbUpdate(query, values);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, message: 'Customer updated successfully' };
  } catch (error) {
    console.error('Error updating customer:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Delete customer
export async function deleteCustomer(id: string): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Check if customer has transactions
    const transactionsResult = await dbQuery(
      'SELECT COUNT(*) as count FROM transactions WHERE party_type = ? AND party_id = ?',
      ['customer', id]
    );
    
    if (transactionsResult.success && transactionsResult.data && transactionsResult.data[0].count > 0) {
      return { 
        success: false, 
        error: 'Cannot delete customer with existing transactions. Please archive instead.' 
      };
    }
    
    const result = await dbUpdate(
      'DELETE FROM customers WHERE id = ?',
      [id]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, message: 'Customer deleted successfully' };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get customer pending payments
export async function getCustomerPendingPayments(customerId: string): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const result = await dbQuery(
      `SELECT id, date, reference, total_amount, payment_date, due_date, status
       FROM transactions
       WHERE party_type = 'customer' AND party_id = ? AND status IN ('pending', 'partial')
       ORDER BY date`,
      [customerId]
    );
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error getting customer pending payments:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get upcoming payment alerts
export async function getPaymentAlerts(): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Get transactions with upcoming due dates (within 7 days)
    const today = formatDate(new Date());
    const result = await dbQuery(
      `SELECT t.id, t.date, t.reference, t.total_amount, t.payment_date, t.due_date, t.status,
              c.id as customer_id, c.name as customer_name, c.credit_days
       FROM transactions t
       JOIN customers c ON t.party_id = c.id
       WHERE t.party_type = 'customer' 
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
    console.error('Error getting payment alerts:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

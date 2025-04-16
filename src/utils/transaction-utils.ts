
import { dbQuery, dbUpdate, isElectron } from './electron-utils';
import { toast } from '@/components/ui/toast-utils';
import { formatDate } from './nepali-date';
import { DbResult } from './db-operations';

export interface Transaction {
  id: string;
  transaction_type: string;
  date: string;
  reference?: string;
  party_type?: 'customer' | 'supplier';
  party_id?: string;
  amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method?: string;
  payment_date?: string;
  due_date?: string;
  status: 'pending' | 'paid' | 'partial' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id?: number;
  transaction_id: string;
  item_id: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  tax_percent: number;
  amount: number;
}

// Calculate due date based on transaction date and credit days
function calculateDueDate(transactionDate: string, creditDays: number): string {
  const date = new Date(transactionDate);
  date.setDate(date.getDate() + creditDays);
  return formatDate(date);
}

// Get all transactions with optional filtering
export async function getTransactions(filters?: {
  type?: string;
  partyType?: string;
  partyId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
}): Promise<DbResult<Transaction[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params: any[] = [];
    
    if (filters) {
      if (filters.type) {
        query += ' AND transaction_type = ?';
        params.push(filters.type);
      }
      
      if (filters.partyType) {
        query += ' AND party_type = ?';
        params.push(filters.partyType);
      }
      
      if (filters.partyId) {
        query += ' AND party_id = ?';
        params.push(filters.partyId);
      }
      
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }
      
      if (filters.fromDate) {
        query += ' AND date >= ?';
        params.push(filters.fromDate);
      }
      
      if (filters.toDate) {
        query += ' AND date <= ?';
        params.push(filters.toDate);
      }
    }
    
    query += ' ORDER BY date DESC';
    
    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    
    const result = await dbQuery(query, params);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error getting transactions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get transaction by ID
export async function getTransactionById(id: string): Promise<DbResult<{ transaction: Transaction; items: TransactionItem[] }>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Get transaction header
    const transactionResult = await dbQuery(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );
    
    if (!transactionResult.success) {
      return { success: false, error: transactionResult.error };
    }
    
    if (!transactionResult.data || transactionResult.data.length === 0) {
      return { success: false, error: `Transaction with ID '${id}' not found` };
    }
    
    const transaction = transactionResult.data[0];
    
    // Get transaction items
    const itemsResult = await dbQuery(
      'SELECT * FROM transaction_items WHERE transaction_id = ?',
      [id]
    );
    
    if (!itemsResult.success) {
      return { success: false, error: itemsResult.error };
    }
    
    const items = itemsResult.data || [];
    
    return { 
      success: true, 
      data: { 
        transaction, 
        items 
      } 
    };
  } catch (error) {
    console.error('Error getting transaction:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Create new transaction with items
export async function createTransaction(
  transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<TransactionItem, 'id' | 'transaction_id'>[]
): Promise<DbResult<string>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Start a transaction
    await dbUpdate('BEGIN TRANSACTION');
    
    try {
      // Generate transaction ID
      const prefix = getTransactionPrefix(transaction.transaction_type);
      const idResult = await dbQuery(
        `SELECT id FROM transactions WHERE transaction_type = ? ORDER BY id DESC LIMIT 1`,
        [transaction.transaction_type]
      );
      
      let nextId = `${prefix}001`;
      
      if (idResult.success && idResult.data && idResult.data.length > 0) {
        const lastId = idResult.data[0].id;
        const idNumber = parseInt(lastId.substring(prefix.length), 10);
        nextId = `${prefix}${(idNumber + 1).toString().padStart(3, '0')}`;
      }
      
      // If this is a credit transaction for a customer/supplier, calculate the due date
      let dueDate: string | undefined = transaction.due_date;
      
      if (!dueDate && transaction.payment_date && transaction.party_type && transaction.party_id) {
        // Get credit days for the party
        const query = transaction.party_type === 'customer' 
          ? 'SELECT credit_days FROM customers WHERE id = ?' 
          : 'SELECT credit_days FROM suppliers WHERE id = ?';
        
        const creditDaysResult = await dbQuery(query, [transaction.party_id]);
        
        if (creditDaysResult.success && creditDaysResult.data && creditDaysResult.data.length > 0) {
          const creditDays = creditDaysResult.data[0].credit_days;
          
          if (creditDays > 0) {
            dueDate = calculateDueDate(transaction.payment_date, creditDays);
          }
        }
      }
      
      // Insert transaction header
      const result = await dbUpdate(
        `INSERT INTO transactions (
          id, transaction_type, date, reference, party_type, party_id, 
          amount, tax_amount, discount_amount, total_amount, 
          payment_method, payment_date, due_date, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nextId,
          transaction.transaction_type,
          transaction.date,
          transaction.reference || '',
          transaction.party_type || null,
          transaction.party_id || null,
          transaction.amount || 0,
          transaction.tax_amount || 0,
          transaction.discount_amount || 0,
          transaction.total_amount || 0,
          transaction.payment_method || null,
          transaction.payment_date || null,
          dueDate || null,
          transaction.status || 'pending',
          transaction.notes || ''
        ]
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Insert transaction items
      for (const item of items) {
        const itemResult = await dbUpdate(
          `INSERT INTO transaction_items (
            transaction_id, item_id, description, quantity, 
            unit_price, discount_percent, tax_percent, amount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            nextId,
            item.item_id,
            item.description || '',
            item.quantity || 0,
            item.unit_price || 0,
            item.discount_percent || 0,
            item.tax_percent || 0,
            item.amount || 0
          ]
        );
        
        if (!itemResult.success) {
          throw new Error(itemResult.error);
        }
      }
      
      // If this affects inventory, update stock quantities
      if (['SALE', 'PURC'].includes(transaction.transaction_type)) {
        for (const item of items) {
          const stockChange = transaction.transaction_type === 'PURC' ? item.quantity : -item.quantity;
          
          const updateResult = await dbUpdate(
            `UPDATE inventory_items 
             SET stock_quantity = stock_quantity + ? 
             WHERE id = ?`,
            [stockChange, item.item_id]
          );
          
          if (!updateResult.success) {
            throw new Error(updateResult.error);
          }
        }
      }
      
      // Commit the transaction
      await dbUpdate('COMMIT');
      
      return { success: true, data: nextId, message: 'Transaction created successfully' };
    } catch (error) {
      // Rollback the transaction
      await dbUpdate('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Helper to get transaction prefix
function getTransactionPrefix(type: string): string {
  switch (type) {
    case 'SALE':
      return 'INV';
    case 'PURC':
      return 'PUR';
    case 'PYMT':
      return 'PMT';
    case 'RCPT':
      return 'RCT';
    case 'JRNL':
      return 'JRN';
    default:
      return 'TRN';
  }
}

// Update transaction status
export async function updateTransactionStatus(
  id: string, 
  status: 'pending' | 'paid' | 'partial' | 'cancelled',
  paymentDetails?: {
    amount: number;
    payment_method: string;
    reference?: string;
    date: string;
    notes?: string;
  }
): Promise<DbResult<void>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Start a transaction
    await dbUpdate('BEGIN TRANSACTION');
    
    try {
      // Update transaction status
      const result = await dbUpdate(
        'UPDATE transactions SET status = ? WHERE id = ?',
        [status, id]
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // If payment details provided, record the payment
      if (paymentDetails) {
        const paymentResult = await dbUpdate(
          `INSERT INTO payment_receipts (
            transaction_id, amount, payment_method, reference, date, notes
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            paymentDetails.amount || 0,
            paymentDetails.payment_method || '',
            paymentDetails.reference || '',
            paymentDetails.date,
            paymentDetails.notes || ''
          ]
        );
        
        if (!paymentResult.success) {
          throw new Error(paymentResult.error);
        }
      }
      
      // Commit the transaction
      await dbUpdate('COMMIT');
      
      return { success: true, message: 'Transaction status updated successfully' };
    } catch (error) {
      // Rollback the transaction
      await dbUpdate('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Get all payment alerts for dashboard
export async function getAllPaymentAlerts(): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const today = formatDate(new Date());
    
    // Get customer payments due
    const customerResult = await dbQuery(
      `SELECT t.id, t.date, t.reference, t.total_amount, t.payment_date, t.due_date,
              c.id as party_id, c.name as party_name, 'customer' as party_type,
              'receivable' as alert_type
       FROM transactions t
       JOIN customers c ON t.party_id = c.id
       WHERE t.party_type = 'customer' 
         AND t.status IN ('pending', 'partial')
         AND t.due_date IS NOT NULL
         AND t.due_date <= date(?, '+7 days')
       ORDER BY t.due_date`,
      [today]
    );
    
    // Get supplier payments due
    const supplierResult = await dbQuery(
      `SELECT t.id, t.date, t.reference, t.total_amount, t.payment_date, t.due_date,
              s.id as party_id, s.name as party_name, 'supplier' as party_type,
              'payable' as alert_type
       FROM transactions t
       JOIN suppliers s ON t.party_id = s.id
       WHERE t.party_type = 'supplier' 
         AND t.status IN ('pending', 'partial')
         AND t.due_date IS NOT NULL
         AND t.due_date <= date(?, '+7 days')
       ORDER BY t.due_date`,
      [today]
    );
    
    if (!customerResult.success) {
      return { success: false, error: customerResult.error };
    }
    
    if (!supplierResult.success) {
      return { success: false, error: supplierResult.error };
    }
    
    // Combine both results
    const alerts = [
      ...(customerResult.data || []),
      ...(supplierResult.data || [])
    ].sort((a, b) => {
      // Sort by due date (ascending)
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
    
    return { success: true, data: alerts };
  } catch (error) {
    console.error('Error getting payment alerts:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

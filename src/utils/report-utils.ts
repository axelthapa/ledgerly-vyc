import { dbQuery, isElectron } from './electron-utils';
import { DbResult } from './db-operations';

// Define common report types
export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface ReportFilters {
  fromDate?: string;
  toDate?: string;
  timeFrame?: TimeFrame;
  partyId?: string;
  partyType?: 'customer' | 'supplier';
  transactionType?: string;
  groupBy?: string;
}

// Sales report
export async function getSalesReport(filters: ReportFilters): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    let query = `
      SELECT 
        t.id, t.date, t.reference, t.total_amount, t.status,
        c.id as customer_id, c.name as customer_name
      FROM transactions t
      LEFT JOIN customers c ON t.party_id = c.id
      WHERE t.transaction_type = 'SALE'
    `;
    
    const params: any[] = [];
    
    if (filters.fromDate) {
      query += ' AND t.date >= ?';
      params.push(filters.fromDate);
    }
    
    if (filters.toDate) {
      query += ' AND t.date <= ?';
      params.push(filters.toDate);
    }
    
    if (filters.partyId) {
      query += ' AND t.party_id = ?';
      params.push(filters.partyId);
    }
    
    if (filters.groupBy === 'customer') {
      query = `
        SELECT 
          c.id as customer_id, c.name as customer_name,
          COUNT(t.id) as transaction_count,
          SUM(t.total_amount) as total_amount
        FROM transactions t
        LEFT JOIN customers c ON t.party_id = c.id
        WHERE t.transaction_type = 'SALE'
      `;
      
      if (filters.fromDate) {
        query += ' AND t.date >= ?';
        params.push(filters.fromDate);
      }
      
      if (filters.toDate) {
        query += ' AND t.date <= ?';
        params.push(filters.toDate);
      }
      
      if (filters.partyId) {
        query += ' AND t.party_id = ?';
        params.push(filters.partyId);
      }
      
      query += ' GROUP BY c.id ORDER BY total_amount DESC';
    } else if (filters.groupBy === 'date') {
      query = `
        SELECT 
          t.date,
          COUNT(t.id) as transaction_count,
          SUM(t.total_amount) as total_amount
        FROM transactions t
        WHERE t.transaction_type = 'SALE'
      `;
      
      if (filters.fromDate) {
        query += ' AND t.date >= ?';
        params.push(filters.fromDate);
      }
      
      if (filters.toDate) {
        query += ' AND t.date <= ?';
        params.push(filters.toDate);
      }
      
      if (filters.partyId) {
        query += ' AND t.party_id = ?';
        params.push(filters.partyId);
      }
      
      query += ' GROUP BY t.date ORDER BY t.date';
    } else {
      query += ' ORDER BY t.date DESC';
    }
    
    const result = await dbQuery(query, params);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error generating sales report:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Purchases report
export async function getPurchasesReport(filters: ReportFilters): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    let query = `
      SELECT 
        t.id, t.date, t.reference, t.total_amount, t.status,
        s.id as supplier_id, s.name as supplier_name
      FROM transactions t
      LEFT JOIN suppliers s ON t.party_id = s.id
      WHERE t.transaction_type = 'PURC'
    `;
    
    const params: any[] = [];
    
    if (filters.fromDate) {
      query += ' AND t.date >= ?';
      params.push(filters.fromDate);
    }
    
    if (filters.toDate) {
      query += ' AND t.date <= ?';
      params.push(filters.toDate);
    }
    
    if (filters.partyId) {
      query += ' AND t.party_id = ?';
      params.push(filters.partyId);
    }
    
    if (filters.groupBy === 'supplier') {
      query = `
        SELECT 
          s.id as supplier_id, s.name as supplier_name,
          COUNT(t.id) as transaction_count,
          SUM(t.total_amount) as total_amount
        FROM transactions t
        LEFT JOIN suppliers s ON t.party_id = s.id
        WHERE t.transaction_type = 'PURC'
      `;
      
      if (filters.fromDate) {
        query += ' AND t.date >= ?';
        params.push(filters.fromDate);
      }
      
      if (filters.toDate) {
        query += ' AND t.date <= ?';
        params.push(filters.toDate);
      }
      
      if (filters.partyId) {
        query += ' AND t.party_id = ?';
        params.push(filters.partyId);
      }
      
      query += ' GROUP BY s.id ORDER BY total_amount DESC';
    } else if (filters.groupBy === 'date') {
      query = `
        SELECT 
          t.date,
          COUNT(t.id) as transaction_count,
          SUM(t.total_amount) as total_amount
        FROM transactions t
        WHERE t.transaction_type = 'PURC'
      `;
      
      if (filters.fromDate) {
        query += ' AND t.date >= ?';
        params.push(filters.fromDate);
      }
      
      if (filters.toDate) {
        query += ' AND t.date <= ?';
        params.push(filters.toDate);
      }
      
      if (filters.partyId) {
        query += ' AND t.party_id = ?';
        params.push(filters.partyId);
      }
      
      query += ' GROUP BY t.date ORDER BY t.date';
    } else {
      query += ' ORDER BY t.date DESC';
    }
    
    const result = await dbQuery(query, params);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error generating purchases report:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Receivables aging report
export async function getReceivablesReport(): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT 
        c.id as customer_id, c.name as customer_name,
        t.id as transaction_id, t.date, t.reference, t.total_amount,
        t.due_date,
        CASE
          WHEN julianday(?) - julianday(t.due_date) <= 0 THEN 'current'
          WHEN julianday(?) - julianday(t.due_date) <= 30 THEN '1-30'
          WHEN julianday(?) - julianday(t.due_date) <= 60 THEN '31-60'
          WHEN julianday(?) - julianday(t.due_date) <= 90 THEN '61-90'
          ELSE '90+'
        END as aging
      FROM transactions t
      JOIN customers c ON t.party_id = c.id
      WHERE t.party_type = 'customer' 
        AND t.status IN ('pending', 'partial')
        AND t.due_date IS NOT NULL
      ORDER BY c.name, t.due_date
    `;
    
    const result = await dbQuery(query, [today, today, today, today]);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error generating receivables report:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Payables aging report
export async function getPayablesReport(): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT 
        s.id as supplier_id, s.name as supplier_name,
        t.id as transaction_id, t.date, t.reference, t.total_amount,
        t.due_date,
        CASE
          WHEN julianday(?) - julianday(t.due_date) <= 0 THEN 'current'
          WHEN julianday(?) - julianday(t.due_date) <= 30 THEN '1-30'
          WHEN julianday(?) - julianday(t.due_date) <= 60 THEN '31-60'
          WHEN julianday(?) - julianday(t.due_date) <= 90 THEN '61-90'
          ELSE '90+'
        END as aging
      FROM transactions t
      JOIN suppliers s ON t.party_id = s.id
      WHERE t.party_type = 'supplier' 
        AND t.status IN ('pending', 'partial')
        AND t.due_date IS NOT NULL
      ORDER BY s.name, t.due_date
    `;
    
    const result = await dbQuery(query, [today, today, today, today]);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error generating payables report:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Inventory valuation report
export async function getInventoryReport(): Promise<DbResult<any[]>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const query = `
      SELECT 
        i.id, i.name, i.description, i.type,
        c.name as category,
        i.purchase_price, i.sale_price,
        i.stock_quantity, i.unit,
        (i.purchase_price * i.stock_quantity) as valuation
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      WHERE i.type = 'product'
      ORDER BY i.name
    `;
    
    const result = await dbQuery(query);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Error generating inventory report:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Profit and loss report
export async function getProfitLossReport(filters: ReportFilters): Promise<DbResult<any>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    const params: any[] = [];
    let dateFilter = '';
    
    if (filters.fromDate) {
      dateFilter += ' AND date >= ?';
      params.push(filters.fromDate);
    }
    
    if (filters.toDate) {
      dateFilter += ' AND date <= ?';
      params.push(filters.toDate);
    }
    
    // Sales income
    const salesQuery = `
      SELECT SUM(total_amount) as total
      FROM transactions
      WHERE transaction_type = 'SALE'
      ${dateFilter}
    `;
    
    const salesResult = await dbQuery(salesQuery, params);
    
    if (!salesResult.success) {
      return { success: false, error: salesResult.error };
    }
    
    // Purchases
    const purchasesQuery = `
      SELECT SUM(total_amount) as total
      FROM transactions
      WHERE transaction_type = 'PURC'
      ${dateFilter}
    `;
    
    const purchasesResult = await dbQuery(purchasesQuery, params);
    
    if (!purchasesResult.success) {
      return { success: false, error: purchasesResult.error };
    }
    
    // Expenses
    const expensesQuery = `
      SELECT SUM(amount) as total
      FROM daily_transactions
      WHERE transaction_type = 'expense'
      ${dateFilter}
    `;
    
    const expensesResult = await dbQuery(expensesQuery, params);
    
    if (!expensesResult.success) {
      return { success: false, error: expensesResult.error };
    }
    
    // Other income
    const incomeQuery = `
      SELECT SUM(amount) as total
      FROM daily_transactions
      WHERE transaction_type = 'income'
      ${dateFilter}
    `;
    
    const incomeResult = await dbQuery(incomeQuery, params);
    
    if (!incomeResult.success) {
      return { success: false, error: incomeResult.error };
    }
    
    const totalSales = salesResult.data?.[0]?.total || 0;
    const totalPurchases = purchasesResult.data?.[0]?.total || 0;
    const totalExpenses = expensesResult.data?.[0]?.total || 0;
    const totalOtherIncome = incomeResult.data?.[0]?.total || 0;
    
    const grossProfit = totalSales - totalPurchases;
    const netProfit = grossProfit + totalOtherIncome - totalExpenses;
    
    return { 
      success: true, 
      data: {
        sales: totalSales,
        purchases: totalPurchases,
        grossProfit: grossProfit,
        otherIncome: totalOtherIncome,
        expenses: totalExpenses,
        netProfit: netProfit
      }
    };
  } catch (error) {
    console.error('Error generating profit/loss report:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Dashboard summary
export async function getDashboardSummary(): Promise<DbResult<any>> {
  if (!isElectron()) {
    return { success: false, error: 'Not running in Electron' };
  }
  
  try {
    // Get current month data
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    
    // Monthly sales
    const monthlySalesQuery = `
      SELECT SUM(total_amount) as total
      FROM transactions
      WHERE transaction_type = 'SALE'
        AND date >= ?
        AND date <= ?
    `;
    
    const monthlySalesResult = await dbQuery(monthlySalesQuery, [firstDayOfMonth, lastDayOfMonth]);
    
    if (!monthlySalesResult.success) {
      return { success: false, error: monthlySalesResult.error };
    }
    
    // Monthly purchases
    const monthlyPurchasesQuery = `
      SELECT SUM(total_amount) as total
      FROM transactions
      WHERE transaction_type = 'PURC'
        AND date >= ?
        AND date <= ?
    `;
    
    const monthlyPurchasesResult = await dbQuery(monthlyPurchasesQuery, [firstDayOfMonth, lastDayOfMonth]);
    
    if (!monthlyPurchasesResult.success) {
      return { success: false, error: monthlyPurchasesResult.error };
    }
    
    // Total receivables
    const receivablesQuery = `
      SELECT SUM(total_amount) as total
      FROM transactions
      WHERE party_type = 'customer'
        AND status IN ('pending', 'partial')
    `;
    
    const receivablesResult = await dbQuery(receivablesQuery);
    
    if (!receivablesResult.success) {
      return { success: false, error: receivablesResult.error };
    }
    
    // Total payables
    const payablesQuery = `
      SELECT SUM(total_amount) as total
      FROM transactions
      WHERE party_type = 'supplier'
        AND status IN ('pending', 'partial')
    `;
    
    const payablesResult = await dbQuery(payablesQuery);
    
    if (!payablesResult.success) {
      return { success: false, error: payablesResult.error };
    }
    
    // Get previous month's sales for comparison
    const prevMonthFirstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
    
    const prevMonthlySalesQuery = `
      SELECT SUM(total_amount) as total
      FROM transactions
      WHERE transaction_type = 'SALE'
        AND date >= ?
        AND date <= ?
    `;
    
    const prevMonthlySalesResult = await dbQuery(prevMonthlySalesQuery, [prevMonthFirstDay, prevMonthLastDay]);
    
    if (!prevMonthlySalesResult.success) {
      return { success: false, error: prevMonthlySalesResult.error };
    }
    
    // Get previous month's purchases for comparison
    const prevMonthlyPurchasesQuery = `
      SELECT SUM(total_amount) as total
      FROM transactions
      WHERE transaction_type = 'PURC'
        AND date >= ?
        AND date <= ?
    `;
    
    const prevMonthlyPurchasesResult = await dbQuery(prevMonthlyPurchasesQuery, [prevMonthFirstDay, prevMonthLastDay]);
    
    if (!prevMonthlyPurchasesResult.success) {
      return { success: false, error: prevMonthlyPurchasesResult.error };
    }
    
    const monthlySales = monthlySalesResult.data?.[0]?.total || 0;
    const monthlyPurchases = monthlyPurchasesResult.data?.[0]?.total || 0;
    const totalReceivables = receivablesResult.data?.[0]?.total || 0;
    const totalPayables = payablesResult.data?.[0]?.total || 0;
    
    const prevMonthlySales = prevMonthlySalesResult.data?.[0]?.total || 0;
    const prevMonthlyPurchases = prevMonthlyPurchasesResult.data?.[0]?.total || 0;
    
    // Calculate growth percentages
    const salesGrowth = prevMonthlySales ? ((monthlySales - prevMonthlySales) / prevMonthlySales) * 100 : 0;
    const purchasesGrowth = prevMonthlyPurchases ? ((monthlyPurchases - prevMonthlyPurchases) / prevMonthlyPurchases) * 100 : 0;
    
    return { 
      success: true, 
      data: {
        monthlySales,
        monthlyPurchases,
        totalReceivables,
        totalPayables,
        salesGrowth,
        purchasesGrowth
      }
    };
  } catch (error) {
    console.error('Error generating dashboard summary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

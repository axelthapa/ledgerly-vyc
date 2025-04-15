
-- VYC Accounting System Schema

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_code TEXT UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  tax_number TEXT,
  credit_limit REAL DEFAULT 0,
  outstanding_balance REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_code TEXT UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  tax_number TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_code TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  purchase_price REAL DEFAULT 0,
  selling_price REAL DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Sales Invoices Table
CREATE TABLE IF NOT EXISTS sales_invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT UNIQUE,
  customer_id INTEGER,
  invoice_date TEXT,
  due_date TEXT,
  total_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  grand_total REAL DEFAULT 0,
  paid_amount REAL DEFAULT 0,
  balance_due REAL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Sales Invoice Items Table
CREATE TABLE IF NOT EXISTS sales_invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  product_id INTEGER,
  quantity INTEGER DEFAULT 0,
  unit_price REAL DEFAULT 0,
  discount_percent REAL DEFAULT 0,
  tax_percent REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES sales_invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Purchase Invoices Table
CREATE TABLE IF NOT EXISTS purchase_invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT UNIQUE,
  supplier_id INTEGER,
  invoice_date TEXT,
  due_date TEXT,
  total_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  grand_total REAL DEFAULT 0,
  paid_amount REAL DEFAULT 0,
  balance_due REAL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Purchase Invoice Items Table
CREATE TABLE IF NOT EXISTS purchase_invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  product_id INTEGER,
  quantity INTEGER DEFAULT 0,
  unit_price REAL DEFAULT 0,
  discount_percent REAL DEFAULT 0,
  tax_percent REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  FOREIGN KEY (invoice_id) REFERENCES purchase_invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_number TEXT UNIQUE,
  payment_date TEXT,
  payment_type TEXT,
  amount REAL DEFAULT 0,
  reference_number TEXT,
  notes TEXT,
  related_to TEXT, -- 'customer' or 'supplier'
  related_id INTEGER,
  invoice_id INTEGER,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Daily Cash Transactions
CREATE TABLE IF NOT EXISTS daily_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_date TEXT,
  transaction_type TEXT, -- 'sales', 'expense', 'transfer', etc.
  description TEXT,
  amount REAL DEFAULT 0,
  reference_number TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Create a script to create initial admin user
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  is_active INTEGER DEFAULT 1,
  last_login TEXT,
  created_at TEXT DEFAULT (datetime('now', 'localtime')),
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Insert default admin user (username: admin, password: admin)
INSERT OR IGNORE INTO users (username, password_hash, full_name, role) 
VALUES ('admin', '$2a$10$yfZcJ4R7NXLu7VN7tJ5qNu.d9B6mwph2Nl6z6XBQZn6xOSYqV9hwe', 'Administrator', 'admin');

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES 
('company_name', 'VYC Accounting'),
('company_address', ''),
('company_phone', ''),
('company_email', ''),
('company_tax_number', ''),
('currency_symbol', 'Rs'),
('fiscal_year_start', '07-16'), -- July 16 (Shrawan 1)
('create_backup_reminder_days', '7');


-- Settings table for application configuration
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  is_default INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY, -- Custom format e.g. CN001
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  pan TEXT,
  credit_days INTEGER DEFAULT 0, -- Credit period in days
  opening_balance REAL DEFAULT 0,
  balance_type TEXT DEFAULT 'CR', -- CR for credit, DR for debit
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY, -- Custom format e.g. SP001
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  pan TEXT,
  credit_days INTEGER DEFAULT 0, -- Credit period in days
  opening_balance REAL DEFAULT 0,
  balance_type TEXT DEFAULT 'CR', -- CR for credit, DR for debit
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories for products/services
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'product' or 'service'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products/services table
CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY, -- Custom format e.g. IT001
  name TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  type TEXT NOT NULL, -- 'product' or 'service'
  purchase_price REAL DEFAULT 0,
  sale_price REAL DEFAULT 0,
  stock_quantity REAL DEFAULT 0,
  unit TEXT DEFAULT 'pcs',
  is_taxable INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Transaction types
CREATE TABLE IF NOT EXISTS transaction_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- e.g. SALE, PURC, PYMT, RCPT
  affects_inventory INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default transaction types
INSERT INTO transaction_types (name, code, affects_inventory, description) VALUES
('Sale', 'SALE', 1, 'Sale of products or services'),
('Purchase', 'PURC', 1, 'Purchase of products or services'),
('Payment', 'PYMT', 0, 'Payment to supplier'),
('Receipt', 'RCPT', 0, 'Receipt from customer'),
('Journal', 'JRNL', 0, 'Journal entry');

-- Transactions table (header)
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, -- Custom format e.g. INV001
  transaction_type TEXT NOT NULL, -- SALE, PURC, PYMT, RCPT, JRNL
  date TEXT NOT NULL, -- YYYY-MM-DD
  reference TEXT,
  party_type TEXT, -- 'customer' or 'supplier'
  party_id TEXT, -- Customer or supplier ID
  amount REAL DEFAULT 0,
  tax_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  payment_method TEXT,
  payment_date TEXT, -- YYYY-MM-DD, for credit transactions
  due_date TEXT, -- YYYY-MM-DD, calculated from payment_date + credit_days
  status TEXT DEFAULT 'pending', -- pending, paid, partial, cancelled
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (party_id) REFERENCES customers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (party_id) REFERENCES suppliers(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Transaction details (line items)
CREATE TABLE IF NOT EXISTS transaction_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  description TEXT,
  quantity REAL DEFAULT 0,
  unit_price REAL DEFAULT 0,
  discount_percent REAL DEFAULT 0,
  tax_percent REAL DEFAULT 0,
  amount REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Payments/receipts
CREATE TABLE IF NOT EXISTS payment_receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id TEXT NOT NULL,
  amount REAL DEFAULT 0,
  payment_method TEXT,
  reference TEXT,
  date TEXT NOT NULL, -- YYYY-MM-DD
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Daily cash/bank transactions
CREATE TABLE IF NOT EXISTS daily_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL, -- YYYY-MM-DD
  transaction_type TEXT NOT NULL, -- income, expense, transfer
  amount REAL DEFAULT 0,
  account_from TEXT, -- cash, bank
  account_to TEXT, -- used for transfers
  category TEXT,
  description TEXT,
  reference TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User activity log
CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT DEFAULT 'admin',
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers to update the updated_at fields automatically
CREATE TRIGGER IF NOT EXISTS update_settings_timestamp AFTER UPDATE ON settings
BEGIN
  UPDATE settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_currencies_timestamp AFTER UPDATE ON currencies
BEGIN
  UPDATE currencies SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_customers_timestamp AFTER UPDATE ON customers
BEGIN
  UPDATE customers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_suppliers_timestamp AFTER UPDATE ON suppliers
BEGIN
  UPDATE suppliers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_categories_timestamp AFTER UPDATE ON categories
BEGIN
  UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_inventory_items_timestamp AFTER UPDATE ON inventory_items
BEGIN
  UPDATE inventory_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_transaction_types_timestamp AFTER UPDATE ON transaction_types
BEGIN
  UPDATE transaction_types SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_transactions_timestamp AFTER UPDATE ON transactions
BEGIN
  UPDATE transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_transaction_items_timestamp AFTER UPDATE ON transaction_items
BEGIN
  UPDATE transaction_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_payment_receipts_timestamp AFTER UPDATE ON payment_receipts
BEGIN
  UPDATE payment_receipts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_daily_transactions_timestamp AFTER UPDATE ON daily_transactions
BEGIN
  UPDATE daily_transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_inventory_items_name ON inventory_items(name);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_party ON transactions(party_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_receipts_transaction ON payment_receipts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_daily_transactions_date ON daily_transactions(date);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);


const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Create directory for database templates if it doesn't exist
const templatesDir = path.join(__dirname, 'templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Path to the blank database template
const dbPath = path.join(templatesDir, 'blank_database.db');

// Path to the schema SQL file
const schemaPath = path.join(__dirname, 'schema.sql');

// Delete existing template if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

// Create a new database
const db = new sqlite3.Database(dbPath);

// Read the schema SQL
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

// Execute the schema SQL in a transaction
db.serialize(() => {
  db.exec('BEGIN TRANSACTION;');
  
  // Split the schema SQL into individual statements and execute each one
  const statements = schemaSql.split(';').filter(stmt => stmt.trim());
  statements.forEach(statement => {
    if (statement.trim()) {
      db.exec(statement);
    }
  });
  
  // Create some initial data
  db.run(`INSERT INTO settings (key, value) VALUES ('company_name', 'VYC Accounting')`);
  db.run(`INSERT INTO settings (key, value) VALUES ('company_address', 'Kathmandu, Nepal')`);
  db.run(`INSERT INTO settings (key, value) VALUES ('company_phone', '+977 1234567890')`);
  db.run(`INSERT INTO settings (key, value) VALUES ('company_email', 'info@vyc.com')`);
  db.run(`INSERT INTO settings (key, value) VALUES ('fiscal_year', '2081/2082')`);
  
  // Initial currency
  db.run(`INSERT INTO currencies (code, name, symbol, is_default) VALUES ('NPR', 'Nepalese Rupee', 'रू', 1)`);
  
  db.exec('COMMIT;');
});

// Close the database
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log(`Blank database template created at ${dbPath}`);
  }
});

// Export path for use in electron-builder
module.exports = dbPath;


const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { app } = require('electron');

// Determine the path for the user data directory
const getUserDataPath = () => {
  return process.env.NODE_ENV === 'development' 
    ? path.join(__dirname, 'userdata') 
    : path.join(app.getPath('userData'), 'database');
};

// Ensure database directory exists
const ensureDatabaseDir = () => {
  const dbDir = getUserDataPath();
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  return dbDir;
};

// Get path to the database file
const getDatabasePath = () => {
  const dbDir = ensureDatabaseDir();
  return path.join(dbDir, 'vyc_accounting.db');
};

// Initialize the database connection
const initializeDatabase = () => {
  const dbPath = getDatabasePath();
  
  // If database doesn't exist, create it from template
  if (!fs.existsSync(dbPath)) {
    console.log('Creating new database from template...');
    
    // Template path depends on whether we're in dev or production
    const templatePath = process.env.NODE_ENV === 'development'
      ? path.join(__dirname, 'db', 'templates', 'blank_database.db')
      : path.join(process.resourcesPath, 'db', 'templates', 'blank_database.db');
    
    // Ensure template exists
    if (!fs.existsSync(templatePath)) {
      console.error('Database template not found:', templatePath);
      throw new Error('Database template not found');
    }
    
    // Copy template to user data directory
    fs.copyFileSync(templatePath, dbPath);
    console.log('Database created successfully at:', dbPath);
  }
  
  return new sqlite3.Database(dbPath);
};

// Get database connection
const getDatabase = () => {
  return initializeDatabase();
};

// Execute query and return results
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.all(query, params, (err, rows) => {
      db.close();
      
      if (err) {
        console.error('Database query error:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true, data: rows });
      }
    });
  });
};

// Execute update/insert and return result
const executeUpdate = (query, params = []) => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.run(query, params, function(err) {
      db.close();
      
      if (err) {
        console.error('Database update error:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        resolve({ 
          success: true, 
          changes: this.changes,
          lastInsertRowid: this.lastID
        });
      }
    });
  });
};

module.exports = {
  initializeDatabase,
  executeQuery,
  executeUpdate,
  getDatabasePath
};

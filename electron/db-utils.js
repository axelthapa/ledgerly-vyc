
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
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

// Check if database exists, if not create it from template
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
  
  return new Database(dbPath, { fileMustExist: true });
};

// Get database connection
const getDatabase = () => {
  return initializeDatabase();
};

// Execute query and return results
const executeQuery = (query, params = []) => {
  const db = getDatabase();
  try {
    const stmt = db.prepare(query);
    const result = stmt.all(params);
    return { success: true, data: result };
  } catch (error) {
    console.error('Database query error:', error.message);
    return { success: false, error: error.message };
  } finally {
    db.close();
  }
};

// Execute update/insert and return result
const executeUpdate = (query, params = []) => {
  const db = getDatabase();
  try {
    const stmt = db.prepare(query);
    const result = stmt.run(params);
    return { 
      success: true, 
      changes: result.changes,
      lastInsertRowid: result.lastInsertRowid
    };
  } catch (error) {
    console.error('Database update error:', error.message);
    return { success: false, error: error.message };
  } finally {
    db.close();
  }
};

module.exports = {
  initializeDatabase,
  executeQuery,
  executeUpdate,
  getDatabasePath
};

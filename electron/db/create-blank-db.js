
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const createBlankDatabase = () => {
  console.log('Creating blank database template...');
  
  // Create the templates directory if it doesn't exist
  const templatesDir = path.join(__dirname, 'templates');
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }
  
  const dbPath = path.join(templatesDir, 'blank_database.db');
  
  // If the file exists, remove it first
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
  
  // Create a new database
  const db = new Database(dbPath);
  
  // Read the schema file
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  
  // Execute the schema
  db.exec(schema);
  
  // Close the database connection
  db.close();
  
  console.log('Blank database template created successfully at:', dbPath);
};

// Execute if this script is run directly
if (require.main === module) {
  createBlankDatabase();
}

module.exports = { createBlankDatabase };

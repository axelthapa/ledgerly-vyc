
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

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
  const db = new sqlite3.Database(dbPath);
  
  // Read the schema file
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  
  // Execute the schema
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
    } else {
      console.log('Blank database template created successfully at:', dbPath);
    }
    // Close the database connection
    db.close();
  });
};

// Execute if this script is run directly
if (require.main === module) {
  createBlankDatabase();
}

module.exports = { createBlankDatabase };

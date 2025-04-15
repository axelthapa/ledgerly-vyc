
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure the db templates directory exists
const templatesDir = path.join(__dirname, 'db', 'templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Create LICENSE.txt file if it doesn't exist
const licensePath = path.join(__dirname, 'LICENSE.txt');
if (!fs.existsSync(licensePath)) {
  fs.writeFileSync(
    licensePath,
    'VYC Accounting System\n' +
    'Copyright (c) 2025 VYC\n\n' +
    'All rights reserved.\n' +
    'This software is licensed under the terms of the MIT license.\n'
  );
}

// Create the blank database if it doesn't exist
try {
  require('./db/create-blank-db');
  console.log('✅ Blank database template created successfully');
} catch (error) {
  console.error('❌ Error creating blank database template:', error);
  process.exit(1);
}

// Build the React application for production
console.log('🔨 Building the React application...');
try {
  // Navigate to the parent directory where the React app is located
  process.chdir('..');
  
  // Run the build command
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React application built successfully');
  
  // Return to the electron directory
  process.chdir('electron');
} catch (error) {
  console.error('❌ Error building React application:', error);
  process.exit(1);
}

// Build the Electron application for Windows
console.log('🔨 Building the Electron application for Windows...');
try {
  execSync('npm run build-win', { stdio: 'inherit' });
  console.log('✅ Electron application built successfully');
  console.log('📦 Installer can be found in the electron/dist folder');
} catch (error) {
  console.error('❌ Error building Electron application:', error);
  process.exit(1);
}

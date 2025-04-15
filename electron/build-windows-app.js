
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure necessary dependencies are installed in the electron directory
console.log('📦 Checking and installing dependencies in electron directory...');
try {
  // Check if sqlite3 is installed
  try {
    require('sqlite3');
    console.log('✅ sqlite3 module is already installed');
  } catch (e) {
    console.log('🔄 Installing sqlite3 module...');
    execSync('npm install sqlite3', { stdio: 'inherit' });
    console.log('✅ sqlite3 module installed successfully');
  }
} catch (error) {
  console.error('❌ Error installing dependencies:', error);
  process.exit(1);
}

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
  // Get the project root directory
  const projectRoot = path.resolve(__dirname, '..');
  
  // Make sure we're in the project root directory where package.json exists
  process.chdir(projectRoot);
  
  // Install the required packages if they're not already installed
  console.log('📦 Ensuring build dependencies are installed...');
  try {
    // Check if vite is installed by trying to require it
    execSync('npm list vite --depth=0', { stdio: 'ignore' });
    console.log('✅ Vite is already installed');
  } catch (e) {
    console.log('🔄 Installing vite package...');
    execSync('npm install --no-save vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
    console.log('✅ Vite packages installed successfully');
  }
  
  // Run the build command
  console.log('🏗️ Running vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ React application built successfully');
  
  // Return to the electron directory
  process.chdir(path.join(projectRoot, 'electron'));
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

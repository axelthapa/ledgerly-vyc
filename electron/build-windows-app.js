
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
  // Skip React build when developing Electron separately
  const skipReactBuild = process.env.SKIP_REACT_BUILD === 'true';
  
  if (skipReactBuild) {
    console.log('⏩ Skipping React build (SKIP_REACT_BUILD=true)');
  } else {
    // Get the project root directory
    const projectRoot = path.resolve(__dirname, '..');
    
    // Make sure we're in the project root directory where package.json exists
    process.chdir(projectRoot);
    
    // Check if the dist folder already exists
    const distPath = path.join(projectRoot, 'dist');
    if (fs.existsSync(distPath)) {
      console.log('✅ Using existing build in dist folder');
    } else {
      console.log('❗ React application build is required but may encounter issues.');
      console.log('❗ If the build fails, please build the React app manually:');
      console.log('❗ 1. Open a terminal in the project root');
      console.log('❗ 2. Run: npm install');
      console.log('❗ 3. Run: npm run build');
      console.log('❗ 4. Then run this script again with: SKIP_REACT_BUILD=true node electron/build-windows-app.js');
      
      try {
        // Try to build using npm script
        console.log('🔄 Running npm build script...');
        execSync('npm run build', { stdio: 'inherit' });
        console.log('✅ React application built successfully');
      } catch (e) {
        console.error('❌ React build failed:', e.message);
        console.log('❗ Please follow the manual build instructions above.');
        process.exit(1);
      }
    }
    
    // Return to the electron directory
    process.chdir(path.join(projectRoot, 'electron'));
  }
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

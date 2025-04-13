
# VYC Accounting System - Desktop Application

This document explains how to run the VYC Accounting System as a desktop application using Electron.

## Setting Up Development Environment

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Development Setup

1. **Install dependencies for the web application:**

```bash
# From the project root
npm install
```

2. **Install Electron dependencies:**

```bash
# Navigate to the electron folder
cd electron
npm install
```

3. **Run the application in development mode:**

First, start the Vite development server:

```bash
# From the project root
npm run dev
```

Then, in a separate terminal, start Electron:

```bash
# From the electron folder
npm run dev
```

### Building for Production

1. **Build the web application:**

```bash
# From the project root
npm run build
```

2. **Build the Electron application:**

```bash
# From the electron folder
npm run build
```

The built application will be available in the `electron/dist` folder.

## Features Available in Desktop Version

- **Save/Load Data**: Save and load application data to/from the local file system
- **Export to PDF**: Export reports and documents directly to PDF
- **Native Integration**: Uses native OS dialogs for file operations
- **Offline Support**: Works completely offline

## Troubleshooting

- If you encounter any issues with the Electron app not starting, check the console for error messages.
- Make sure all dependencies are correctly installed.
- Ensure the web application builds successfully before attempting to build the Electron app.

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

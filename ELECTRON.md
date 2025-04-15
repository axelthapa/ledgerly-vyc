
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

3. **Create the blank database template:**

```bash
# From the electron folder
node db/create-blank-db.js
```

4. **Run the application in development mode:**

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

2. **Make sure the blank database template exists:**

```bash
# From the electron folder
node db/create-blank-db.js
```

3. **Build the Electron application:**

```bash
# From the electron folder
npm run build
```

The built application will be available in the `electron/dist` folder.

## Features Available in Desktop Version

- **Local SQLite Database**: All data is stored in a local SQLite database
- **Save/Load Data**: Save and load application data to/from the local file system
- **Export to PDF**: Export reports and documents directly to PDF
- **Database Backup**: Create backups of your database
- **Native Integration**: Uses native OS dialogs for file operations
- **Offline Support**: Works completely offline

## Database Information

The application uses SQLite for data storage. The database file is located at:

- **Windows**: `%APPDATA%\vyc-accounting-electron\database\vyc_accounting.db`
- **macOS**: `~/Library/Application Support/vyc-accounting-electron/database/vyc_accounting.db`
- **Linux**: `~/.config/vyc-accounting-electron/database/vyc_accounting.db`

During development, the database is stored in the `electron/userdata` directory.

### Database Structure

The database includes the following tables:

- `customers` - Customer information
- `suppliers` - Supplier information
- `products` - Product catalog
- `sales_invoices` - Sales invoice headers
- `sales_invoice_items` - Sales invoice line items
- `purchase_invoices` - Purchase invoice headers
- `purchase_invoice_items` - Purchase invoice line items
- `payments` - Payment transactions
- `daily_transactions` - Daily cash transactions
- `users` - User accounts for authentication
- `settings` - Application settings

## Troubleshooting

- If you encounter any issues with the Electron app not starting, check the console for error messages.
- Make sure all dependencies are correctly installed.
- Ensure the web application builds successfully before attempting to build the Electron app.
- If you encounter database errors, try removing the database file and restarting the application to recreate it.

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)


# Database Templates

This directory contains SQLite database templates used by the VYC Accounting System.

## blank_database.db

This file is the initial blank database template that will be used when creating a new database for a user. It contains the schema with all necessary tables but no data.

The template is created using the schema defined in `../schema.sql`.

## Notes for Developers

- Do not manually modify the database files in this directory
- To update the database schema, modify the `../schema.sql` file
- The blank template is automatically generated during the build process


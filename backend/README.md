# FreshBooks Backend

Python/Flask backend with PostgreSQL database for the FreshBooks clone application.

**→ Full tutorial:** See [Full Tutorial: How to Run the Program](#full-tutorial-how-to-run-the-program) for step-by-step instructions and multiple options (pgAdmin, psql, PowerShell, curl, Postman) to create the database and initialize the app.

## Prerequisites

### 1. Install PostgreSQL

Download and install PostgreSQL from: https://www.postgresql.org/download/windows/

During installation:
- **Remember the password** you set for the `postgres` user
- Keep the default port: `5432`
- PostgreSQL will run as a Windows service automatically

After installation, you can verify it's running by opening **pgAdmin** (installed with PostgreSQL) or using the command line.

### 2. Install Python

Download Python 3.11+ from: https://www.python.org/downloads/

**Important**: Check "Add Python to PATH" during installation!

---

## Full Tutorial: How to Run the Program

This section walks you through running the full stack from scratch, with multiple options for each step.

### Recommended order

1. Create the database (PostgreSQL)  
2. Configure the backend (`.env`)  // use your PostgreSQL password
3. Install backend dependencies and start the backend  
4. Initialize the database (create tables + default user)  
5. Run the frontend and log in  

You can do step 4 in several ways: **frontend**, **curl**, **PowerShell**, or **Postman**.

---

### Phase 1: Create the database in PostgreSQL

You only need **one** of these options.

#### Option A: pgAdmin (GUI)

1. Open **pgAdmin** (installed with PostgreSQL).
2. Connect to your server (enter the `postgres` user password if prompted).
3. Right-click **Databases** → **Create** → **Database**.
4. In **Database**, type: `freshbooks`.
5. Click **Save**.

#### Option B: psql (command line)

1. Open **PowerShell** or **Command Prompt**.
2. Run:
   ```bash
   psql -U postgres
   ```
3. Enter your PostgreSQL password when prompted.
4. Run:
   ```sql
   CREATE DATABASE freshbooks;
   \q
   ```

#### Option C: SQL Shell (Windows)

1. From the Start menu, open **SQL Shell (psql)**.
2. Press Enter for default server, port, user (postgres).
3. Enter your password.
4. Run:
   ```sql
   CREATE DATABASE freshbooks;
   \q
   ```

---

### Phase 2: Configure the backend

1. In the project, go to the `backend` folder.
2. If there is no `.env` file, create one (or copy from `.env.example`):
   ```powershell
   copy .env.example .env
   ```
3. Edit `.env` and set your PostgreSQL password and any other values:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_actual_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=freshbooks
   SECRET_KEY=your-super-secret-key-change-in-production
   ```

---

### Phase 3: Install dependencies and start the backend

1. Open a terminal in the **backend** folder.
2. Install Python dependencies (use the same Python that runs the app):
   ```powershell
   python -m pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```powershell
   python app.py
   ```
4. Leave this terminal open. The backend runs at **http://localhost:5000**.

---

### Phase 4: Initialize the database

Initialization creates all tables and, if none exist, a default tenant and user. The backend must be running (Phase 3). Use **one** of the options below.

**Note:** The init endpoint expects a **POST** request. Typing the URL in the browser (GET) will not run it.

#### Option A: Via the frontend (easiest)

1. Start the frontend (see Phase 5).
2. Open the app in your browser (e.g. http://localhost:5173).
3. The app calls `POST /api/init` on load. Tables and the default user are created automatically.
4. Log in with: **admin@freshbooks.local** / **admin123**.

#### Option B: PowerShell

With the backend running, open a **new** PowerShell window and run:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/init" -Method POST -ContentType "application/json" -Body "{}"
```

Or using `Invoke-WebRequest`:

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/init" -Method POST -ContentType "application/json" -Body "{}"
```

#### Option C: curl (if installed)

```bash
curl -X POST http://localhost:5000/api/init -H "Content-Type: application/json" -d "{}"
```

#### Option D: Postman (or similar)

1. Open Postman.
2. Create a new request.
3. Set **Method** to **POST**.
4. Set **URL** to: `http://localhost:5000/api/init`.
5. In **Headers**, add: `Content-Type: application/json`.
6. In **Body**, choose **raw** and **JSON**, and leave `{}` or empty.
7. Click **Send**.

After a successful init you should see a JSON response with `"success": true` and tenant/user info. Default login:

- **Email:** admin@freshbooks.local  
- **Password:** admin123  

---

### Phase 5: Run the frontend

1. Open a **new** terminal (backend keeps running in the first).
2. Go to the **project root** (where `package.json` is, not inside `backend`):
   ```powershell
   cd C:\Users\zoen\Downloads\OJT\Projects\FreshBooks
   ```
3. Install frontend dependencies (first time only):
   ```powershell
   npm install
   ```
4. Start the dev server:
   ```powershell
   npm run dev
   ```
5. Open the URL shown (e.g. http://localhost:5173) in your browser.
6. If you initialized via frontend (Phase 4 Option A), you’re done. Otherwise, initialize first (Phase 4 Option B, C, or D), then refresh the app and log in with **admin@freshbooks.local** / **admin123**.

---

### Quick reference: order of operations

| Step | Action |
|------|--------|
| 1 | Create database `freshbooks` in PostgreSQL (Phase 1). |
| 2 | Set `backend/.env` (Phase 2). |
| 3 | `cd backend` → `python -m pip install -r requirements.txt` → `python app.py` (Phase 3). |
| 4 | Initialize: use frontend, PowerShell, curl, or Postman (Phase 4). |
| 5 | In another terminal: project root → `npm install` (if needed) → `npm run dev` (Phase 5). |
| 6 | Open app in browser and log in. |

---

## Setup Instructions (short reference)

### Step 1: Create the Database

Use any option from **Phase 1** above (pgAdmin, psql, or SQL Shell). Database name: `freshbooks`.

### Step 2: Configure Environment Variables

Copy `.env.example` to `.env` in the `backend` folder and set `DB_PASSWORD` and other values. See **Phase 2** above.

### Step 3: Install Python Dependencies

From the `backend` folder:
```powershell
python -m pip install -r requirements.txt
```
If you get "No module named 'flask'" when running `python app.py`, use `python -m pip install -r requirements.txt` so packages install into the same Python you use to run the app.

### Step 4: Start the Backend Server

From the `backend` folder:
```powershell
python app.py
```
Server runs at **http://localhost:5000**.

### Step 5: Initialize the Database

Use one of the options in **Phase 4** above: frontend, PowerShell, curl, or Postman. Default login after init:

- **Email:** admin@freshbooks.local  
- **Password:** admin123

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server and database are running

### Authentication
- `POST /api/auth/register` - Register new user/tenant
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get single invoice
- `GET /api/invoices/next-number` - Get next invoice number
- `POST /api/invoices` - Create invoice (requires client_id)
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Estimates
- `GET /api/estimates` - List all estimates
- `GET /api/estimates/:id` - Get single estimate
- `GET /api/estimates/next-number` - Get next estimate number
- `POST /api/estimates` - Create estimate (requires client_id)
- `PUT /api/estimates/:id` - Update estimate
- `DELETE /api/estimates/:id` - Delete estimate
- `POST /api/estimates/:id/convert` - Convert to invoice

### Expenses
- `GET /api/expenses` - List all expenses
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Payments
- `GET /api/payments` - List all payments
- `POST /api/payments` - Record payment (requires invoice_id)
- `DELETE /api/payments/:id` - Delete payment

### Items (Products/Services)
- `GET /api/items` - List all items
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Vendors
- `GET /api/vendors` - List all vendors
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Team Members
- `GET /api/team` - List all team members
- `POST /api/team` - Create team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member

### Bills
- `GET /api/bills` - List all bills
- `POST /api/bills` - Create bill
- `DELETE /api/bills/:id` - Delete bill

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Multi-Tenancy

This application supports multi-tenancy. Each organization (tenant) has its own isolated data.

- All API requests should include the `X-Tenant-ID` header
- If not provided, the system uses the default tenant
- All data is scoped to the tenant (clients, invoices, etc.)

## Database Schema

The database uses **UUID** for all primary keys for better security and global uniqueness.

### Main Tables:
- `tenants` - Organizations/Companies
- `users` - User accounts
- `clients` - Customers
- `invoices` - Invoices with line items
- `invoice_items` - Invoice line items
- `estimates` - Estimates/Proposals
- `estimate_items` - Estimate line items
- `expenses` - Expense tracking
- `payments` - Payment records
- `items` - Product/Service catalog
- `vendors` - Suppliers
- `bills` - Bills payable
- `team_members` - Team/Staff
- `recurring_templates` - Recurring invoice templates

## Troubleshooting

### "Unable to connect to backend"
1. Make sure PostgreSQL is running (check Windows Services)
2. Make sure the backend server is running (`python app.py`)
3. Check that your `.env` file has the correct database credentials

### "Database connection failed"
1. Verify PostgreSQL is running
2. Check that the `freshbooks` database exists
3. Verify the password in `.env` matches your PostgreSQL password

### "Microsoft Visual C++ 14.0 or greater is required" (psycopg2)
This project uses **pg8000** (pure Python) instead of psycopg2, so you don't need C++ Build Tools. If you see this error, make sure you're using the updated `requirements.txt` and run `pip install -r requirements.txt` again.

## Development

To run in development mode with auto-reload:
```bash
python app.py
```

The Flask development server will automatically reload when you make changes to the code.

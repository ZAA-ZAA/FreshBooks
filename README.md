# BookFlow

Invoicing and billing web app: clients, invoices, estimates, expenses, payments, and reports.  
Python/Flask backend with PostgreSQL; React frontend.

---

## What you need

- **Node.js** 18+ — https://nodejs.org/
- **Python** 3.11+ — https://www.python.org/downloads/ (check **Add Python to PATH**)
- **PostgreSQL** 14+ — https://www.postgresql.org/download/

Optional for Docker:

- **Docker** and **Docker Compose** — https://docs.docker.com/get-docker/

---

## Option A: Run with Docker

1. In the project root:

   ```bash
   docker-compose up --build
   ```

2. Open **http://localhost:3000** in your browser (same port as in the Vite log). The app initializes the database automatically on first load.

3. Log in with **admin@bookflow.local** / **admin123** (created on first init).

To run in the background:

```bash
docker-compose up -d --build
```

To stop:

```bash
docker-compose down
```

**Email (OTP, send invoice/estimate) in Docker:** Edit `docker-compose.yml` and set `SMTP_EMAIL` and `SMTP_PASSWORD` in the `backend` service to your Gmail and [App Password](https://support.google.com/accounts/answer/185833). Defaults are placeholders; replace them to enable email.

---

## Option B: Run without Docker (Python + npm)

1. **Create the database** in PostgreSQL (e.g. in pgAdmin or psql):

   ```sql
   CREATE DATABASE bookflow;
   ```

2. **Configure the backend:** in the `backend` folder, copy `.env.example` to `.env` and set your PostgreSQL password and options:

   ```env
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bookflow
   SECRET_KEY=your-secret-key
   ```

   Optional (OTP and send-by-email): set `SMTP_EMAIL`, `SMTP_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`.

3. **Start the backend** (from the `backend` folder):

   ```bash
   python -m pip install -r requirements.txt
   python app.py
   ```

   Leave this terminal open. Backend runs at **http://localhost:5000**.

4. **Start the frontend** (from the project root, in a new terminal):

   ```bash
   npm install
   npm run dev
   ```

5. Open **http://localhost:5173** (or the URL shown). The app initializes the database automatically on first load. Log in with **admin@bookflow.local** / **admin123**.

---

## Resetting the database

### If you run with Docker

1. Stop and remove containers and the Postgres volume (this deletes all data):

   ```bash
   docker-compose down -v
   ```

2. Start again; the database is recreated empty:

   ```bash
   docker-compose up -d
   ```

3. Open the app in the browser; init runs again and the default user is recreated. Log in with **admin@bookflow.local** / **admin123**.

### If you run with Python + PostgreSQL (no Docker)

1. Stop the backend (Ctrl+C in the terminal where `python app.py` is running).

2. Drop and recreate the database (e.g. in pgAdmin or psql):

   ```sql
   DROP DATABASE IF EXISTS bookflow;
   CREATE DATABASE bookflow;
   ```

3. Start the backend again:

   ```bash
   python app.py
   ```

4. Open the app in the browser; init runs again and the default user is recreated. Log in with **admin@bookflow.local** / **admin123**.

---

## Exposing with Cloudflare Tunnel (Docker)

To access the app at a public URL (e.g. `https://zoen.divinelifemorialpark.com`):

1. Run the app with Docker: `docker-compose up --build` (frontend on port **3000**, backend on **5000**).
2. In Cloudflare Tunnel (`config.yml`), point **one** hostname to the frontend only:
   - `service: http://localhost:3000`
3. Run: `cloudflared tunnel run my-tunnel`.

The frontend is configured so that when you open the site via the tunnel (not localhost), API calls use the same origin (`/api`). Vite proxies `/api` to the backend, so the tunnel only needs to target port 3000. No separate API hostname or CORS changes are required.

---

## Troubleshooting

- **“Unable to connect to backend”** — Make sure the backend is running (`python app.py` or Docker) and that `.env` (or Docker env) has the correct DB settings.
- **“Database connection failed”** — Check that the `bookflow` database exists and the password matches your PostgreSQL user.
- **“No module named 'flask'”** — Run `python -m pip install -r requirements.txt` from the `backend` folder.
- **OTP or send-email not working** — Set `SMTP_EMAIL` and `SMTP_PASSWORD` in `backend/.env` (or in Docker env). For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833).

---

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind, React Router, Recharts, jsPDF, html2canvas  
- **Backend:** Python, Flask, Flask-CORS, SQLAlchemy, pg8000 (PostgreSQL)  
- **Database:** PostgreSQL (UUID primary keys, multi-tenant)

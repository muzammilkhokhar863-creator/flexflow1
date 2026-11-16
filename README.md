# FixFlow

FixFlow is a smart-device repair and tracking app built with React, Vite, and a small Node.js API.

## Run the project

Install the existing dependencies once, then start both the frontend and API with one command:

```powershell
npm install
npm run dev
```

Open the local URL printed in the terminal. If port 5173 is busy, Vite automatically picks the next available port. The API health check is http://127.0.0.1:4000/api/health. Press Ctrl+C to stop the app.

## Manager demo account

To create a manager account, set these variables in the same PowerShell terminal before `npm run dev`:

```powershell
$env:FIXFLOW_MANAGER_EMAIL = "manager@example.com"
$env:FIXFLOW_MANAGER_PASSWORD = "choose-a-password-with-8-or-more-characters"
$env:FIXFLOW_MANAGER_NAME = "FixFlow Manager"
npm run dev
```

Customer registrations create customer accounts. Do not share real passwords in the repository.

## Build

```powershell
npm run build
```

Customer data is stored locally under `src/backend/data` for this class prototype. See `src/backend/README.md` for API details and limitations.

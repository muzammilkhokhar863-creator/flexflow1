# FixFlow local API

This small Node.js API supports customer signup, login, logout, and checking the current session. It uses only Node's built-in libraries, so it does not need another package install.

## Start the API

Open a terminal at the React project folder and run:

```powershell
node .\src\backend\server.js
```

The API listens on `http://127.0.0.1:4000`. Check that it is running by opening `http://127.0.0.1:4000/api/health`; the response should include `"status":"ok"`.

## Start the React app

Open a second terminal at the project folder and run:

```powershell
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173`. Start the API first so signup and login can reach it.

## Create a manager account

Manager access is not selected from the email address. Configure the manager account in the terminal before starting the API:

```powershell
$env:FIXFLOW_MANAGER_EMAIL = "manager@example.com"
$env:FIXFLOW_MANAGER_PASSWORD = "choose-a-password-with-8-or-more-characters"
$env:FIXFLOW_MANAGER_NAME = "FixFlow Manager"
node .\src\backend\server.js
```

The configured manager email and password are refreshed from these environment variables when the API starts. Customer signup cannot assign a manager role.

## Local data and limits

Customer accounts are saved in `data/users.json`. Passwords are stored as salted scrypt hashes, not as plain text. That local data folder is ignored by Git. Login sessions use HTTP-only cookies and are held in memory, so users need to sign in again after the API restarts.

This file-backed API is for the class prototype. A deployed app should use a database, HTTPS, a configured allowed frontend origin, and persistent session storage.

@echo off
echo ? Starting RezStack Sovereign...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
  echo Installing dependencies...
  npm install
)

REM Start Vite directly
echo Starting dev server on http://localhost:3000...
npx vite --host

pause

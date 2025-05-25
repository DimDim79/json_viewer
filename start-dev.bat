@echo off
echo Starting JSON Viewer in Development Mode...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo Starting development server...
start cmd /k "npm run dev:vite"

timeout /t 3 /nobreak > nul

echo.
echo Development server is starting...
echo Opening http://localhost:3000 in your default browser...
start http://localhost:3000

echo.
echo Press any key to exit (server will keep running)...
pause > nul
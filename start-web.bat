@echo off
echo Starting JSON Viewer Web Server...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Check if dist folder exists
if not exist "dist" (
    echo Building application...
    npm run build:vite
)

echo Starting server...
start cmd /k "npm run serve"

timeout /t 3 /nobreak > nul

echo.
echo JSON Viewer is starting...
echo Opening http://localhost:3000 in your default browser...
start http://localhost:3000

echo.
echo Press any key to exit (server will keep running)...
pause > nul
@echo off
title LeaAnne's WoW Companion
color 0B

echo ========================================================
echo         LEAANNE'S WORLD OF WARCRAFT COMPANION
echo ========================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH!
    echo Please download and install Node.js (LTS version) from:
    echo https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [1/3] Node.js detected:
node -v
echo.

:: 2. Check if node_modules exists, otherwise install dependencies
if not exist "node_modules\" (
    echo [2/3] First-time setup: Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install packages.
        pause
        exit /b 1
    )
) else (
    echo [2/3] Packages already installed.
)
echo.

:: 3. Launch browser and dev server
echo [3/3] Starting dashboard at http://localhost:3000 ...
echo Opening browser in 3 seconds...
start "" http://localhost:3000

echo.
echo Dashboard is running! Keep this window open while using the app.
echo Press Ctrl + C in this window when you want to stop the app.
echo.

call npm run dev
pause

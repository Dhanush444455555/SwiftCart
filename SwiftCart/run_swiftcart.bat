@echo off
title SwiftCart Launcher
color 0A
echo ============================================
echo         SwiftCart - Single Link Setup
echo ============================================
echo.

echo [Step 1/3] Building frontend...
cd /d "%~dp001_frontend"
call npm install --silent
call npm run build

echo.
echo [Step 2/3] Preparing MySQL Database & Seeding Products...
cd /d "%~dp0backend"
call npm install --silent
call node initDb.js
call node data/seedFlipkartAmazon.js

echo.
echo [Step 3/3] Starting server...
echo.
echo ============================================
echo   App is running at: http://localhost:5000
echo   Open this link in your browser!
echo ============================================
echo.

start "" "http://localhost:5000"
node server.js

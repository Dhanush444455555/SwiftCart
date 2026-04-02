@echo off
title SwiftCart Launcher
color 0A
echo ============================================
echo         SwiftCart - Single Link Setup
echo ============================================
echo.

echo [Step 1/2] Building frontend...
cd /d c:\Users\HP\SwiftCart\SwiftCart\01_frontend
call npm install --silent
call npm run build

echo.
echo [Step 2/2] Starting server...
echo.
echo ============================================
echo   App is running at: http://localhost:5000
echo   Open this link in your browser!
echo ============================================
echo.

cd /d c:\Users\HP\SwiftCart\SwiftCart\backend
call npm install --silent
start "" "http://localhost:5000"
node server.js

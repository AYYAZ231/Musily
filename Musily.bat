@echo off
title Musily - Music & Live Party
echo ========================================================
echo               Starting Musily Music App
echo       Spotify + YouTube Music + Live Party Sync
echo ========================================================
echo.

cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%

echo [1/2] Verifying dependencies...
if not exist "node_modules" (
    echo Installing node dependencies...
    call npm install
)

echo [2/2] Launching Musily App on Windows...
start http://localhost:3000
call npm run dev

@echo off
cd /d "%~dp0"
echo.
echo   Installerer avhengigheter ...
call npm install
echo.
echo   Starter TXTk ...
npm start
pause

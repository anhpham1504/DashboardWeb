@echo off
setlocal

title FPT Polytechnic Dashboard
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 22.5 or newer is required.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not available. Reinstall Node.js and try again.
  pause
  exit /b 1
)

node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>22||(major===22&&minor>=5)?0:1)"
if errorlevel 1 (
  echo Node.js 22.5 or newer is required. Current version:
  node --version
  pause
  exit /b 1
)

if not exist package.json (
  echo package.json was not found. Keep run.bat in the project folder.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :failed
)

echo Opening http://localhost:3000
start "" "http://localhost:3000"
echo Starting development server...
call npm run dev
exit /b %errorlevel%

:failed
echo.
echo Startup failed. Review the error above and the setup section in README.md.
pause
exit /b 1

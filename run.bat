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

if not exist .env (
  if not exist .env.example (
    echo .env.example was not found.
    pause
    exit /b 1
  )
  copy /y .env.example .env >nul
  echo A safe template was copied to .env.
  echo Configure DATABASE_URL and APP_ORIGINS, then run this file again.
  pause
  exit /b 1
)

findstr /b "DATABASE_URL" .env | findstr /c:"file:" >nul
if not errorlevel 1 (
  echo .env still points to SQLite. Configure a MySQL DATABASE_URL before continuing.
  pause
  exit /b 1
)

findstr /c:"change-me" .env >nul
if not errorlevel 1 (
  echo Replace the change-me placeholder in .env before continuing.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :failed
)

echo Generating Prisma Client...
call npm run db:generate
if errorlevel 1 goto :failed

echo Applying pending MySQL migrations without resetting data...
call npm run db:migrate
if errorlevel 1 goto :failed

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

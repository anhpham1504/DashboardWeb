@echo off
setlocal

title FPT Polytechnic Dashboard

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  echo Please install Node.js, then run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed or not available in PATH.
  echo Please install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist package.json (
  echo package.json was not found.
  echo Please keep run.bat inside the project folder.
  pause
  exit /b 1
)

if not exist .env if exist .env.example (
  echo Creating .env from .env.example...
  copy /y .env.example .env >nul
)

set "DASHBOARD_NEEDS_SEED=0"
if not exist prisma\dev.db set "DASHBOARD_NEEDS_SEED=1"

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Preparing database...
call npm run db:generate
if errorlevel 1 (
  echo Prisma Client generation failed.
  pause
  exit /b 1
)

call npx prisma migrate deploy
if errorlevel 1 (
  echo Database migration failed.
  pause
  exit /b 1
)

if "%DASHBOARD_NEEDS_SEED%"=="1" (
  echo Adding starter data...
  call npm run db:seed
  if errorlevel 1 (
    echo Database seeding failed.
    pause
    exit /b 1
  )
)

echo Opening http://localhost:3000
start "" "http://localhost:3000"

echo Starting development server...
call npm run dev

pause

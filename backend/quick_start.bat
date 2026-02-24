@echo off
REM AquaPure Backend - Quick Start Setup for Windows

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════╗
echo ║  🌊 AquaPure Backend - Quick Start Setup 🌊 ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Python is installed
echo Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)
echo ✅ Python found

REM Navigate to backend directory
cd /d "%~dp0"

echo.
echo Setting up Python virtual environment...
if not exist "venv" (
    python -m venv venv
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)

REM Activate virtual environment
call venv\Scripts\activate.bat
echo ✅ Virtual environment activated

REM Install requirements
echo.
echo Installing dependencies...
pip install -r requirements.txt
echo ✅ Dependencies installed

REM Check for .env file
echo.
echo Checking environment configuration...
if not exist ".env" (
    echo ⚠️  .env file not found
    echo Creating .env from .env.example...
    copy .env.example .env
    echo ✅ Created .env from .env.example
    echo 📝 Please edit .env with your configuration
    echo.
    echo Required at minimum:
    echo   - MONGODB_URI=your_mongodb_connection_string
    pause
) else (
    echo ✅ .env file found
)

REM Run health check
echo.
echo Running health check...
python health_check.py
if errorlevel 1 (
    echo ❌ Health check failed
    echo Please check your .env configuration
    pause
    exit /b 1
)

REM Offer to seed database
echo.
set /p SEED_OPTION="Would you like to seed demo products? (y/n): "
if /i "%SEED_OPTION%"=="y" (
    echo Seeding demo data...
    python seed_products.py
    echo ✅ Database seeded successfully
)

REM Start server
echo.
echo Starting backend server...
echo ✅ Server running at http://localhost:5000
echo ✅ API docs at http://localhost:5000/docs
echo ✅ Press Ctrl+C to stop
echo.

python main.py

pause

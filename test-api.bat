@echo off
REM BCK Manager API Test Script for Windows
REM Tests the authentication API endpoints

echo.
echo ============================================
echo   BCK Manager API - Quick Test Script
echo ============================================
echo.
echo Testing API endpoints on http://localhost:5000
echo.

REM Test 1: Health Check
echo [1] Testing Health Check...
curl -s http://localhost:5000/health | find "OK" >nul
if %errorlevel% equ 0 (
    echo ✓ Server is running
) else (
    echo ✗ Server is not running. Start it with: npm run dev
    exit /b 1
)

echo.
echo [2] Testing Login with valid credentials...

REM Test 2: Login
for /f "tokens=*" %%a in ('curl -s -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"bckduc\",\"password\":\"123456\"}"') do set LOGIN_RESPONSE=%%a

echo %LOGIN_RESPONSE% | find "success" >nul
if %errorlevel% equ 0 (
    echo ✓ Login successful
    echo Response: %LOGIN_RESPONSE%
) else (
    echo ✗ Login failed
    echo Response: %LOGIN_RESPONSE%
    exit /b 1
)

echo.
echo [3] Testing Login with invalid password...

REM Test 3: Invalid Password
curl -s -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"bckduc\",\"password\":\"wrongpassword\"}" | find "Invalid" >nul
if %errorlevel% equ 0 (
    echo ✓ Invalid password correctly rejected
) else (
    echo ✗ Invalid password test failed
)

echo.
echo ============================================
echo   Tests Complete!
echo ============================================
echo.
echo Next steps:
echo   1. Use TESTING.md for detailed test cases
echo   2. Import BCK_Manager_API.postman_collection.json into Postman
echo   3. Update frontend to call: POST /api/auth/login
echo.
pause

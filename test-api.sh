#!/bin/bash

# BCK Manager API Test Script for Linux/macOS
# Tests the authentication API endpoints

echo ""
echo "============================================"
echo "  BCK Manager API - Quick Test Script"
echo "============================================"
echo ""
echo "Testing API endpoints on http://localhost:5000"
echo ""

# Test 1: Health Check
echo "[1] Testing Health Check..."
HEALTH_RESPONSE=$(curl -s http://localhost:5000/health)
if echo "$HEALTH_RESPONSE" | grep -q "OK"; then
    echo "✓ Server is running"
else
    echo "✗ Server is not running. Start it with: npm run dev"
    exit 1
fi

echo ""
echo "[2] Testing Login with valid credentials..."

# Test 2: Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bckduc","password":"123456"}')

if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo "✓ Login successful"
    echo "Response: $LOGIN_RESPONSE" | head -c 100
    echo "..."
else
    echo "✗ Login failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo ""
echo "[3] Testing Login with invalid password..."

# Test 3: Invalid Password
INVALID_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"bckduc","password":"wrongpassword"}')

if echo "$INVALID_RESPONSE" | grep -q "Invalid"; then
    echo "✓ Invalid password correctly rejected"
else
    echo "✗ Invalid password test failed"
fi

echo ""
echo "============================================"
echo "  Tests Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Use TESTING.md for detailed test cases"
echo "  2. Import BCK_Manager_API.postman_collection.json into Postman"
echo "  3. Update frontend to call: POST /api/auth/login"
echo ""

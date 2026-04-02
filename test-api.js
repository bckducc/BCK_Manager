#!/usr/bin/env node

/**
 * BCK Manager API Test Script
 * Tests authentication endpoints with detailed output
 * Usage: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
const API_PORT = 5000;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data ? JSON.parse(data) : null,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  log('\n============================================', 'bold');
  log('  BCK Manager API - Test Suite', 'bold');
  log('============================================\n', 'bold');

  log('Testing API endpoints on ' + BASE_URL, 'blue');

  const tests = [];

  // Test 1: Health Check
  try {
    log('\n[1] Testing Health Check...', 'yellow');
    const healthResponse = await makeRequest('GET', '/health');
    
    if (healthResponse.status === 200 && healthResponse.data.status === 'OK') {
      log('✓ PASS: Server is running', 'green');
      tests.push({ name: 'Health Check', passed: true });
    } else {
      log('✗ FAIL: Unexpected response', 'red');
      tests.push({ name: 'Health Check', passed: false });
    }
  } catch (err) {
    log(`✗ FAIL: Cannot connect to server - ${err.message}`, 'red');
    log('Make sure the server is running: npm run dev', 'yellow');
    tests.push({ name: 'Health Check', passed: false });
    process.exit(1);
  }

  // Test 2: Login Success
  try {
    log('\n[2] Testing Login with valid credentials...', 'yellow');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'bckduc',
      password: '123456'
    });

    if (loginResponse.status === 200 && loginResponse.data.success && loginResponse.data.token) {
      log('✓ PASS: Login successful', 'green');
      log(`   Token: ${loginResponse.data.token.substring(0, 30)}...`, 'blue');
      log(`   User: ${loginResponse.data.user.username} (${loginResponse.data.user.role})`, 'blue');
      tests.push({ name: 'Login Success', passed: true });
      
      // Save token for next test
      global.testToken = loginResponse.data.token;
    } else {
      log('✗ FAIL: Login failed', 'red');
      log(`   Response: ${JSON.stringify(loginResponse.data)}`, 'red');
      tests.push({ name: 'Login Success', passed: false });
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}`, 'red');
    tests.push({ name: 'Login Success', passed: false });
  }

  // Test 3: Login with Invalid Password
  try {
    log('\n[3] Testing Login with invalid password...', 'yellow');
    const invalidResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'bckduc',
      password: 'wrongpassword'
    });

    if (invalidResponse.status === 401 && !invalidResponse.data.success) {
      log('✓ PASS: Invalid password correctly rejected', 'green');
      tests.push({ name: 'Invalid Password Rejection', passed: true });
    } else {
      log('✗ FAIL: Should reject invalid password', 'red');
      tests.push({ name: 'Invalid Password Rejection', passed: false });
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}`, 'red');
    tests.push({ name: 'Invalid Password Rejection', passed: false });
  }

  // Test 4: Login with Non-existent User
  try {
    log('\n[4] Testing Login with non-existent user...', 'yellow');
    const notFoundResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'nonexistentuser',
      password: '123456'
    });

    if (notFoundResponse.status === 401 && !notFoundResponse.data.success) {
      log('✓ PASS: Non-existent user correctly rejected', 'green');
      tests.push({ name: 'Non-existent User Rejection', passed: true });
    } else {
      log('✗ FAIL: Should reject non-existent user', 'red');
      tests.push({ name: 'Non-existent User Rejection', passed: false });
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}`, 'red');
    tests.push({ name: 'Non-existent User Rejection', passed: false });
  }

  // Test 5: Get User Info with Valid Token
  if (global.testToken) {
    try {
      log('\n[5] Testing Get User Info with valid token...', 'yellow');
      const options = {
        hostname: 'localhost',
        port: API_PORT,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${global.testToken}`
        }
      };

      const meResponse = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            resolve({
              status: res.statusCode,
              data: data ? JSON.parse(data) : null
            });
          });
        });
        req.on('error', reject);
        req.end();
      });

      if (meResponse.status === 200 && meResponse.data.user) {
        log('✓ PASS: Retrieved user information', 'green');
        log(`   User: ${meResponse.data.user.username}`, 'blue');
        log(`   Role: ${meResponse.data.user.role}`, 'blue');
        tests.push({ name: 'Get User Info', passed: true });
      } else {
        log('✗ FAIL: Could not retrieve user info', 'red');
        tests.push({ name: 'Get User Info', passed: false });
      }
    } catch (err) {
      log(`✗ FAIL: ${err.message}`, 'red');
      tests.push({ name: 'Get User Info', passed: false });
    }
  }

  // Test 6: Get User Info with Invalid Token
  try {
    log('\n[6] Testing Get User Info with invalid token...', 'yellow');
    const options = {
      hostname: 'localhost',
      port: API_PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid_token_here'
      }
    };

    const invalidTokenResponse = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null
          });
        });
      });
      req.on('error', reject);
      req.end();
    });

    if (invalidTokenResponse.status === 401 && !invalidTokenResponse.data.success) {
      log('✓ PASS: Invalid token correctly rejected', 'green');
      tests.push({ name: 'Invalid Token Rejection', passed: true });
    } else {
      log('✗ FAIL: Should reject invalid token', 'red');
      tests.push({ name: 'Invalid Token Rejection', passed: false });
    }
  } catch (err) {
    log(`✗ FAIL: ${err.message}`, 'red');
    tests.push({ name: 'Invalid Token Rejection', passed: false });
  }

  // Summary
  log('\n============================================', 'bold');
  log('  Test Summary', 'bold');
  log('============================================\n', 'bold');

  const passed = tests.filter(t => t.passed).length;
  const total = tests.length;

  tests.forEach((test, index) => {
    const status = test.passed ? '✓ PASS' : '✗ FAIL';
    const color = test.passed ? 'green' : 'red';
    log(`${index + 1}. ${status}: ${test.name}`, color);
  });

  log(`\nResults: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');

  if (passed === total) {
    log('\n✓ All tests passed! Backend is working correctly.', 'green');
    log('\nNext steps:');
    log('  1. Update frontend Login.tsx to call POST /api/auth/login', 'blue');
    log('  2. Update AuthContext.tsx to use real backend instead of mock', 'blue');
    log('  3. Test frontend-backend integration', 'blue');
  } else {
    log('\n✗ Some tests failed. Check the errors above.', 'red');
  }

  process.exit(passed === total ? 0 : 1);
}

// Run tests
runTests().catch((err) => {
  log(`\n✗ Test suite error: ${err.message}`, 'red');
  process.exit(1);
});

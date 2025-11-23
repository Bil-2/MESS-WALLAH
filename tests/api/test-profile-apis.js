#!/usr/bin/env node

/**
 * MESS WALLAH - Enhanced Profile System API Tests
 * Tests the new profile management endpoints
 * Created: September 26, 2025
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001';
const API_BASE = `${BASE_URL}/api`;

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

async function testAPI(method, endpoint, data = null, expectedStatus = 200, description = '', headers = {}) {
  totalTests++;
  
  try {
    const config = {
      method: method.toLowerCase(),
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put' || method.toLowerCase() === 'patch')) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      success(`${method} ${endpoint} - ${description || 'Success'}`);
      passedTests++;
      testResults.push({ endpoint, method, status: 'PASSED', description });
      return response.data;
    } else {
      error(`${method} ${endpoint} - Expected ${expectedStatus}, got ${response.status}`);
      failedTests++;
      testResults.push({ endpoint, method, status: 'FAILED', description, error: `Status mismatch` });
      return null;
    }
  } catch (err) {
    const status = err.response?.status || 'Network Error';
    const message = err.response?.data?.message || err.message;
    
    if (status === expectedStatus) {
      success(`${method} ${endpoint} - ${description || 'Expected error'} (${status})`);
      passedTests++;
      testResults.push({ endpoint, method, status: 'PASSED', description });
      return err.response?.data;
    } else {
      error(`${method} ${endpoint} - ${description || 'Failed'} (${status}: ${message})`);
      failedTests++;
      testResults.push({ endpoint, method, status: 'FAILED', description, error: message });
      return null;
    }
  }
}

async function runProfileTests() {
  log('\n🚀 MESS WALLAH - Enhanced Profile API Tests', 'cyan');
  log('==============================================\n', 'cyan');
  
  // Test variables
  let authToken = null;
  let testUser = null;
  
  // 1. Health Check
  info('1. Testing Server Health...');
  await testAPI('GET', '/../health', null, 200, 'Server health check');
  
  // 2. Register Test User
  info('\n2. Testing User Registration...');
  const registerData = {
    name: 'Profile Test User',
    email: `profiletest${Date.now()}@example.com`,
    password: 'TestPassword123!',
    phone: '9876543210',
    role: 'user'
  };
  
  const registerResponse = await testAPI('POST', '/auth/register', registerData, 201, 'User registration');
  if (registerResponse && registerResponse.token) {
    authToken = registerResponse.token;
    testUser = registerResponse.user;
    success('✓ Authentication token obtained');
  }
  
  if (!authToken) {
    error('❌ Cannot proceed without authentication token');
    return;
  }
  
  const authHeaders = { 'Authorization': `Bearer ${authToken}` };
  
  // 3. Test Profile Retrieval
  info('\n3. Testing Profile Retrieval...');
  await testAPI('GET', '/users/profile', null, 200, 'Get user profile', authHeaders);
  await testAPI('GET', '/auth/me', null, 200, 'Get current user (auth endpoint)', authHeaders);
  
  // 4. Test Profile Update
  info('\n4. Testing Profile Updates...');
  const profileUpdateData = {
    name: 'Updated Profile Test User',
    bio: 'This is a test bio for the enhanced profile system',
    city: 'Mumbai',
    state: 'Maharashtra'
  };
  
  await testAPI('PUT', '/users/profile', profileUpdateData, 200, 'Update user profile', authHeaders);
  await testAPI('PUT', '/auth/profile', profileUpdateData, 200, 'Update profile (auth endpoint)', authHeaders);
  
  // 5. Test Dashboard Statistics
  info('\n5. Testing Dashboard Statistics...');
  await testAPI('GET', '/users/dashboard/stats', null, 200, 'Get dashboard statistics', authHeaders);
  
  // 6. Test Activity Timeline
  info('\n6. Testing Activity Timeline...');
  await testAPI('GET', '/users/dashboard/activity', null, 200, 'Get activity timeline', authHeaders);
  await testAPI('GET', '/users/dashboard/activity?page=1&limit=5', null, 200, 'Get paginated activity', authHeaders);
  
  // 7. Test Favorites System
  info('\n7. Testing Favorites System...');
  await testAPI('GET', '/users/my-favorites', null, 200, 'Get user favorites', authHeaders);
  
  // 8. Test Platform Statistics (Public)
  info('\n8. Testing Public Statistics...');
  await testAPI('GET', '/users/stats/platform', null, 200, 'Get platform statistics');
  
  // 9. Test Password Change
  info('\n9. Testing Password Management...');
  const passwordChangeData = {
    currentPassword: 'TestPassword123!',
    newPassword: 'NewTestPassword123!',
    confirmPassword: 'NewTestPassword123!'
  };
  
  await testAPI('PUT', '/auth/change-password', passwordChangeData, 200, 'Change password', authHeaders);
  
  // 10. Test Profile Validation
  info('\n10. Testing Profile Validation...');
  const invalidProfileData = {
    name: '', // Invalid: empty name
    bio: 'A'.repeat(1001), // Invalid: too long
    city: 'Test City',
    state: 'Test State'
  };
  
  await testAPI('PUT', '/users/profile', invalidProfileData, 400, 'Invalid profile data (should fail)', authHeaders);
  
  // 11. Test Unauthorized Access
  info('\n11. Testing Security & Authorization...');
  await testAPI('GET', '/users/profile', null, 401, 'Unauthorized access (should fail)');
  await testAPI('GET', '/users/dashboard/stats', null, 401, 'Unauthorized dashboard access (should fail)');
  
  // Print Results Summary
  log('\n📊 PROFILE API TEST RESULTS', 'magenta');
  log('============================', 'magenta');
  
  testResults.forEach(result => {
    const status = result.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED';
    const color = result.status === 'PASSED' ? 'green' : 'red';
    log(`${status} - ${result.method} ${result.endpoint} - ${result.description}`, color);
  });
  
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
  
  log(`\n📈 Overall Results:`, 'cyan');
  log(`   Total Tests: ${totalTests}`, 'blue');
  log(`   Passed: ${passedTests}`, 'green');
  log(`   Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`   Success Rate: ${successRate}%`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');
  
  if (failedTests === 0) {
    log('\n🎉 All Enhanced Profile API tests passed! The profile system is working perfectly.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some profile API tests failed. Please check the backend server and try again.', 'yellow');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n\n🛑 Profile API tests interrupted by user', 'yellow');
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('\n\n🛑 Profile API tests terminated', 'yellow');
  process.exit(1);
});

// Run the tests
runProfileTests().catch(error => {
  error('💥 Fatal error running profile API tests:', error.message);
  process.exit(1);
});

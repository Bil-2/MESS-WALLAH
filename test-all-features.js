/**
 * Comprehensive Feature Test Script
 * Tests all major features of MESS WALLAH application
 */

const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const FRONTEND_URL = 'http://localhost:5173';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, method = 'GET', data = null) {
  try {
    const config = { method, url: `${API_URL}${url}` };
    if (data) config.data = data;
    
    const response = await axios(config);
    log(`✅ ${name}: SUCCESS (${response.status})`, 'green');
    return { success: true, data: response.data };
  } catch (error) {
    log(`❌ ${name}: FAILED (${error.response?.status || 'Network Error'})`, 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'yellow');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('\n🚀 Starting Comprehensive Feature Tests\n', 'cyan');
  log('=' .repeat(60), 'blue');

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: Health Check
  log('\n📊 Testing Health & Status', 'cyan');
  const health = await testEndpoint('Health Check', '/test');
  results.total++;
  if (health.success) results.passed++; else results.failed++;

  // Test 2: Rooms API
  log('\n🏠 Testing Rooms API', 'cyan');
  const rooms = await testEndpoint('Get Rooms', '/rooms?limit=5');
  results.total++;
  if (rooms.success) results.passed++; else results.failed++;

  const featured = await testEndpoint('Get Featured Rooms', '/rooms/featured');
  results.total++;
  if (featured.success) results.passed++; else results.failed++;

  const stats = await testEndpoint('Get Room Stats', '/rooms/stats');
  results.total++;
  if (stats.success) results.passed++; else results.failed++;

  // Test 3: City Search
  log('\n🌆 Testing City Search', 'cyan');
  const cities = ['Kolkata', 'Delhi', 'Bangalore', 'Pune', 'Chennai'];
  for (const city of cities) {
    const result = await testEndpoint(`Search ${city}`, `/rooms?search=${city}&limit=2`);
    results.total++;
    if (result.success && result.data.data && result.data.data.length > 0) {
      results.passed++;
      log(`   Found ${result.data.data.length} rooms in ${city}`, 'green');
    } else {
      results.failed++;
    }
  }

  // Test 4: Authentication Endpoints
  log('\n🔐 Testing Authentication', 'cyan');
  const authStatus = await testEndpoint('Google OAuth Status', '/auth/google/status');
  results.total++;
  if (authStatus.success) results.passed++; else results.failed++;

  // Test 5: Search Functionality
  log('\n🔍 Testing Search', 'cyan');
  const search = await testEndpoint('Advanced Search', '/search/advanced?city=Bangalore&minRent=5000&maxRent=15000');
  results.total++;
  if (search.success) results.passed++; else results.failed++;

  // Test 6: Frontend Accessibility
  log('\n🌐 Testing Frontend', 'cyan');
  try {
    const frontendResponse = await axios.get(FRONTEND_URL);
    if (frontendResponse.status === 200) {
      log('✅ Frontend: ACCESSIBLE', 'green');
      results.passed++;
    }
  } catch (error) {
    log('❌ Frontend: NOT ACCESSIBLE', 'red');
    results.failed++;
  }
  results.total++;

  // Test 7: Database Connection
  log('\n💾 Testing Database', 'cyan');
  const dbHealth = await testEndpoint('Database Health', '/test');
  if (dbHealth.success && dbHealth.data.system?.database === 'Connected') {
    log('✅ Database: CONNECTED', 'green');
    results.passed++;
  } else {
    log('❌ Database: NOT CONNECTED', 'red');
    results.failed++;
  }
  results.total++;

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('\n📈 Test Summary', 'cyan');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`, 
      results.failed === 0 ? 'green' : 'yellow');

  if (results.failed === 0) {
    log('\n🎉 All tests passed! Application is working perfectly!', 'green');
  } else {
    log(`\n⚠️  ${results.failed} test(s) failed. Please check the errors above.`, 'yellow');
  }

  log('\n' + '='.repeat(60) + '\n', 'blue');
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});

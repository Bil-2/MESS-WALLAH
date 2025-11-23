#!/usr/bin/env node

/**
 * MESS WALLAH - Comprehensive API Test Suite Runner
 * 
 * This script runs all API tests to verify the backend functionality
 * Usage: npm run test:api
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 MESS WALLAH - API Test Suite Runner');
console.log('=====================================\n');

const testFiles = [
  'api/test-all-apis.js',
  'api/test-profile-apis.js',
  'api/test-email-apis.js', 
  'api/test-sms-apis.js'
];

const runTest = (testFile) => {
  return new Promise((resolve, reject) => {
    const testPath = path.join(__dirname, testFile);
    
    if (!fs.existsSync(testPath)) {
      console.log(`❌ Test file not found: ${testFile}`);
      resolve({ file: testFile, success: false, error: 'File not found' });
      return;
    }

    console.log(`🧪 Running ${testFile}...`);
    
    const child = spawn('node', [testPath], {
      stdio: 'pipe',
      cwd: path.dirname(__dirname)
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const success = code === 0;
      
      if (success) {
        console.log(`✅ ${testFile} - PASSED\n`);
      } else {
        console.log(`❌ ${testFile} - FAILED (Exit code: ${code})\n`);
        if (stderr) {
          console.log(`Error output:\n${stderr}\n`);
        }
      }

      resolve({
        file: testFile,
        success,
        code,
        stdout,
        stderr
      });
    });

    child.on('error', (error) => {
      console.log(`❌ ${testFile} - ERROR: ${error.message}\n`);
      resolve({
        file: testFile,
        success: false,
        error: error.message
      });
    });
  });
};

const runAllTests = async () => {
  console.log('🔄 Starting API tests...\n');
  
  const results = [];
  
  for (const testFile of testFiles) {
    const result = await runTest(testFile);
    results.push(result);
  }
  
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('=======================');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach(result => {
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    console.log(`${status} - ${result.file}`);
  });
  
  console.log(`\n📈 Overall: ${passed}/${results.length} tests passed`);
  
  if (failed === 0) {
    console.log('🎉 All API tests passed! Your backend is ready for production.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the backend server and try again.');
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test execution interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Test execution terminated');
  process.exit(1);
});

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Fatal error running tests:', error);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * Security Audit Runner
 * Run this before deploying to production
 */

require('dotenv').config();
const SecurityAudit = require('../utils/securityAudit');

async function main() {
  console.log('\n[SECURITY] MESS WALLAH - Security Audit\n');
  
  const audit = new SecurityAudit();
  const report = await audit.runAudit();

  // Exit with error code if critical issues found
  if (report.summary.critical > 0) {
    console.log('\n[FAILED] Security audit failed! Fix critical issues before deployment.\n');
    process.exit(1);
  }

  if (report.summary.warnings > 0) {
    console.log('\n[WARNING] Security audit passed with warnings. Review before production deployment.\n');
    process.exit(0);
  }

  console.log('\n[PASSED] Security audit passed! Your application is secure.\n');
  process.exit(0);
}

main().catch(error => {
  console.error('Error running security audit:', error);
  process.exit(1);
});

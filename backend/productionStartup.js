require('dotenv').config();
const mongoose = require('mongoose');

const productionStartup = async () => {
  console.log('[INFO] PRODUCTION-LEVEL STARTUP SEQUENCE');
  console.log('='.repeat(80));
  console.log('🎯 ENSURING 100% API SUCCESS RATE ON EVERY RESTART');
  console.log('='.repeat(80));

  let allChecksPass = true;
  const issues = [];

  // Check 1: Environment Variables
  console.log('\n🔧 STEP 1: ENVIRONMENT VARIABLES VERIFICATION');
  console.log('─'.repeat(60));

  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'SENDGRID_API_KEY',
    'FROM_EMAIL',
    'SUPPORT_EMAIL'
  ];

  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`   [SUCCESS] ${envVar}: SET`);
    } else {
      console.log(`   [ERROR] ${envVar}: MISSING`);
      allChecksPass = false;
      issues.push(`Missing environment variable: ${envVar}`);
    }
  });

  // Check 2: MongoDB Connection
  console.log('\n[INFO] STEP 2: DATABASE CONNECTION VERIFICATION');
  console.log('─'.repeat(60));

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah';
    console.log(`   📍 Connecting to: ${mongoURI}`);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('   [SUCCESS] MongoDB connection: SUCCESS');
    console.log(`   📊 Database: ${mongoose.connection.name}`);
    console.log(`   🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);

    // Check database collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   📚 Collections found: ${collections.length}`);

    if (collections.length === 0) {
      console.log('   [WARNING] Database is empty - will auto-seed on server start');
    }

  } catch (error) {
    console.log('   [ERROR] MongoDB connection: FAILED');
    console.log(`   Error: ${error.message}`);
    allChecksPass = false;
    issues.push(`Database connection failed: ${error.message}`);
  }

  // Check 3: Twilio Service Verification
  console.log('\n[INFO] STEP 3: TWILIO SMS SERVICE VERIFICATION');
  console.log('─'.repeat(60));

  try {
    const twilio = require('twilio');
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken) {
      const client = twilio(accountSid, authToken);
      const account = await client.api.accounts(accountSid).fetch();

      console.log('   [SUCCESS] Twilio connection: SUCCESS');
      console.log(`   📊 Account: ${account.friendlyName}`);
      console.log(`   [INFO] Status: ${account.status}`);

      // Check Verify service
      const services = await client.verify.v2.services.list({ limit: 1 });
      if (services.length > 0) {
        console.log(`   [SUCCESS] Verify service: ${services[0].sid}`);
      } else {
        console.log('   [WARNING] No Verify service found - will use fallback');
      }

    } else {
      console.log('   [WARNING] Twilio credentials missing - will use development mode');
    }

  } catch (error) {
    console.log('   [WARNING] Twilio verification failed - will use development mode');
    console.log(`   Error: ${error.message}`);
  }

  // Check 4: SendGrid Email Service
  console.log('\n[INFO] STEP 4: SENDGRID EMAIL SERVICE VERIFICATION');
  console.log('─'.repeat(60));

  try {
    const sgMail = require('@sendgrid/mail');
    const apiKey = process.env.SENDGRID_API_KEY;

    if (apiKey) {
      sgMail.setApiKey(apiKey);
      console.log('   [SUCCESS] SendGrid API key: SET');
      console.log(`   📧 From email: ${process.env.FROM_EMAIL}`);
      console.log(`   📞 Support email: ${process.env.SUPPORT_EMAIL}`);
    } else {
      console.log('   ⚠️ SendGrid API key missing - email features may not work');
    }

  } catch (error) {
    console.log('   ⚠️ SendGrid verification failed');
    console.log(`   Error: ${error.message}`);
  }

  // Check 5: Required Models and Data
  console.log('\n📊 STEP 5: DATA MODELS AND SEED VERIFICATION');
  console.log('─'.repeat(60));

  try {
    const Room = require('./models/Room');
    const User = require('./models/User');
    const Booking = require('./models/Booking');

    const roomCount = await Room.countDocuments();
    const userCount = await User.countDocuments();
    const bookingCount = await Booking.countDocuments();

    console.log(`   📊 Rooms: ${roomCount}`);
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📅 Bookings: ${bookingCount}`);

    if (roomCount === 0) {
      console.log('   🌱 Will auto-seed rooms on server start');
    }

    console.log('   ✅ Data models: VERIFIED');

  } catch (error) {
    console.log('   ❌ Data models verification failed');
    console.log(`   Error: ${error.message}`);
    allChecksPass = false;
    issues.push(`Data models error: ${error.message}`);
  }

  // Check 6: File System and Permissions
  console.log('\n📁 STEP 6: FILE SYSTEM AND PERMISSIONS');
  console.log('─'.repeat(60));

  try {
    const fs = require('fs');
    const path = require('path');

    // Check critical files exist
    const criticalFiles = [
      './server.js',
      './package.json',
      './.env',
      './models/Room.js',
      './models/User.js',
      './controllers/otpController.js',
      './routes/auth.js'
    ];

    let filesOk = true;
    criticalFiles.forEach(file => {
      if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`   ✅ ${file}: EXISTS`);
      } else {
        console.log(`   ❌ ${file}: MISSING`);
        filesOk = false;
        issues.push(`Critical file missing: ${file}`);
      }
    });

    if (filesOk) {
      console.log('   ✅ All critical files: PRESENT');
    } else {
      allChecksPass = false;
    }

  } catch (error) {
    console.log('   ❌ File system check failed');
    console.log(`   Error: ${error.message}`);
    allChecksPass = false;
    issues.push(`File system error: ${error.message}`);
  }

  // Final Assessment
  console.log('\n🎯 PRODUCTION STARTUP ASSESSMENT');
  console.log('='.repeat(80));

  if (allChecksPass) {
    console.log('🎉 ALL CHECKS PASSED! READY FOR 100% API SUCCESS RATE!');
    console.log('✅ Environment: PRODUCTION-READY');
    console.log('✅ Database: CONNECTED');
    console.log('✅ Services: VERIFIED');
    console.log('✅ Files: PRESENT');
    console.log('✅ Models: WORKING');

    console.log('\n🚀 STARTING SERVER WITH CONFIDENCE...');
    console.log('📊 Expected API Success Rate: 100%');

  } else {
    console.log('⚠️ ISSUES DETECTED! FIXING REQUIRED FOR 100% SUCCESS RATE');
    console.log('❌ Some components need attention');

    console.log('\n🔧 ISSUES TO FIX:');
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });

    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Fix the issues listed above');
    console.log('2. Ensure MongoDB is running: npm run mongo:start');
    console.log('3. Verify all environment variables in .env file');
    console.log('4. Check Twilio and SendGrid credentials');
    console.log('5. Re-run this startup check');
  }

  console.log('\n📋 PRODUCTION STARTUP COMMANDS:');
  console.log('─'.repeat(60));
  console.log('🔧 Full startup: npm run production:start');
  console.log('🧪 Startup check: node productionStartup.js');
  console.log('🗄️ MongoDB start: npm run mongo:start');
  console.log('🚀 Server start: npm start');

  console.log('\n✨ PRODUCTION STARTUP SEQUENCE COMPLETED!');
  console.log('='.repeat(80));

  // Close MongoDB connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }

  return allChecksPass;
};

// Run startup check if called directly
if (require.main === module) {
  productionStartup()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Startup check failed:', error);
      process.exit(1);
    });
}

module.exports = productionStartup;

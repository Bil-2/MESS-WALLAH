/**
 * Fix Duplicate Accounts Script
 * Merges duplicate user accounts created by different login methods
 * Run this script to clean up existing duplicates
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const AccountLinkingService = require('../services/accountLinkingService');
require('dotenv').config();

async function fixDuplicateAccounts() {
  try {
    console.log('🔧 Starting duplicate account fix...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-wallah');
    console.log('✅ Connected to MongoDB\n');

    // Find all users
    const allUsers = await User.find({}).select('+password +registrationMethod +accountType');
    console.log(`📊 Total users found: ${allUsers.length}\n`);

    // Group users by email and phone
    const emailMap = new Map();
    const phoneMap = new Map();
    const duplicates = [];

    for (const user of allUsers) {
      // Check email duplicates
      if (user.email) {
        const email = user.email.toLowerCase();
        if (emailMap.has(email)) {
          duplicates.push({
            type: 'email',
            email,
            users: [emailMap.get(email), user]
          });
        } else {
          emailMap.set(email, user);
        }
      }

      // Check phone duplicates (with variants)
      if (user.phone) {
        const phoneVariants = AccountLinkingService.generatePhoneVariants(user.phone);
        for (const variant of phoneVariants) {
          if (phoneMap.has(variant)) {
            const existing = phoneMap.get(variant);
            if (existing._id.toString() !== user._id.toString()) {
              duplicates.push({
                type: 'phone',
                phone: variant,
                users: [existing, user]
              });
            }
          } else {
            phoneMap.set(variant, user);
          }
        }
      }
    }

    console.log(`🔍 Found ${duplicates.length} potential duplicate groups\n`);

    if (duplicates.length === 0) {
      console.log('✅ No duplicates found! Database is clean.\n');
      await mongoose.disconnect();
      return;
    }

    // Process each duplicate group
    let mergedCount = 0;
    const processed = new Set();

    for (const dup of duplicates) {
      const [user1, user2] = dup.users;
      const key = [user1._id, user2._id].sort().join('-');

      if (processed.has(key)) continue;
      processed.add(key);

      console.log(`\n🔗 Processing duplicate ${dup.type}:`);
      console.log(`   User 1: ${user1._id} - ${user1.name} (${user1.email || user1.phone})`);
      console.log(`   User 2: ${user2._id} - ${user2.name} (${user2.email || user2.phone})`);

      // Determine which user to keep (priority: complete > email > otp)
      let targetUser, sourceUser;

      if (user1.accountType === 'unified' || (user1.email && user1.password)) {
        targetUser = user1;
        sourceUser = user2;
      } else if (user2.accountType === 'unified' || (user2.email && user2.password)) {
        targetUser = user2;
        sourceUser = user1;
      } else if (user1.email && !user2.email) {
        targetUser = user1;
        sourceUser = user2;
      } else if (user2.email && !user1.email) {
        targetUser = user2;
        sourceUser = user1;
      } else {
        // Keep the older account
        targetUser = user1.createdAt < user2.createdAt ? user1 : user2;
        sourceUser = targetUser === user1 ? user2 : user1;
      }

      console.log(`   → Keeping: ${targetUser._id} (${targetUser.accountType || 'unknown'})`);
      console.log(`   → Merging: ${sourceUser._id} (${sourceUser.accountType || 'unknown'})`);

      try {
        // Merge accounts
        await AccountLinkingService.mergeAccounts(targetUser, sourceUser);
        mergedCount++;
        console.log(`   ✅ Merged successfully`);
      } catch (error) {
        console.log(`   ❌ Merge failed: ${error.message}`);
      }
    }

    console.log(`\n✅ Duplicate fix complete!`);
    console.log(`   Merged: ${mergedCount} duplicate accounts`);
    console.log(`   Remaining users: ${await User.countDocuments()}\n`);

    // Show final statistics
    const stats = await AccountLinkingService.getAccountStats();
    console.log('📊 Final Account Statistics:');
    console.log(JSON.stringify(stats, null, 2));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  fixDuplicateAccounts()
    .then(() => {
      console.log('\n🎉 Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = fixDuplicateAccounts;

#!/bin/bash

# MESS WALLAH - MongoDB Startup Script
# This script ensures MongoDB is running before starting the backend

echo "🔄 Checking MongoDB status..."

# Check if MongoDB is already running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is already running"
else
    echo "🚀 Starting MongoDB..."
    
    # Try to start MongoDB using brew services
    if command -v brew &> /dev/null; then
        brew services start mongodb/brew/mongodb-community
        echo "✅ MongoDB started via Homebrew"
    else
        # Fallback to manual start
        mongod --config /usr/local/etc/mongod.conf --fork
        echo "✅ MongoDB started manually"
    fi
    
    # Wait for MongoDB to be ready
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 3
fi

# Verify connection
echo "🔍 Testing MongoDB connection..."
if mongosh --eval "db.adminCommand('ismaster')" --quiet > /dev/null 2>&1; then
    echo "✅ MongoDB connection successful!"
    echo "🎉 Ready to start MESS WALLAH backend"
elif mongo --eval "db.adminCommand('ismaster')" --quiet > /dev/null 2>&1; then
    echo "✅ MongoDB connection successful!"
    echo "🎉 Ready to start MESS WALLAH backend"
else
    echo "❌ MongoDB connection failed"
    echo "💡 Try running: brew install mongodb-community"
    echo "💡 Then run: brew services start mongodb/brew/mongodb-community"
    exit 1
fi

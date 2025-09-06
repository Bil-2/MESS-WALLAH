#!/bin/bash

# MESS WALLAH - MongoDB Startup Script
# This script ensures MongoDB is running before starting the backend

echo "🔄 Checking MongoDB status..."

# Function to check if MongoDB is running
check_mongodb() {
    if pgrep -x "mongod" > /dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to test MongoDB connection
test_connection() {
    if mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        return 0
    elif mongo --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if MongoDB is already running
if check_mongodb; then
    echo "✅ MongoDB is already running"
else
    echo "🚀 Starting MongoDB..."
    
    # Check if Homebrew is installed
    if command -v brew &> /dev/null; then
        # Check if MongoDB is installed via Homebrew
        if brew list | grep -q mongodb-community; then
            echo "📦 Starting MongoDB via Homebrew..."
            brew services start mongodb/brew/mongodb-community
            
            # Wait for service to start
            sleep 5
            
            # Verify it started
            if check_mongodb; then
                echo "✅ MongoDB started successfully via Homebrew"
            else
                echo "⚠️  Homebrew service started but MongoDB process not detected"
                echo "💡 Trying alternative startup method..."
                mongod --config /usr/local/etc/mongod.conf --fork 2>/dev/null || mongod --fork 2>/dev/null
            fi
        else
            echo "❌ MongoDB not found via Homebrew"
            echo "💡 Installing MongoDB Community Edition..."
            brew tap mongodb/brew
            brew install mongodb-community
            brew services start mongodb/brew/mongodb-community
            sleep 5
        fi
    else
        echo "⚠️  Homebrew not found, trying manual start..."
        # Try different common MongoDB paths
        if [ -f "/usr/local/bin/mongod" ]; then
            /usr/local/bin/mongod --fork --logpath /tmp/mongodb.log
        elif [ -f "/opt/homebrew/bin/mongod" ]; then
            /opt/homebrew/bin/mongod --fork --logpath /tmp/mongodb.log
        else
            echo "❌ MongoDB not found in common locations"
            echo "💡 Please install MongoDB first:"
            echo "   brew install mongodb-community"
            exit 1
        fi
    fi
    
    # Wait for MongoDB to be ready
    echo "⏳ Waiting for MongoDB to be ready..."
    for i in {1..10}; do
        if test_connection; then
            break
        fi
        echo "   Attempt $i/10..."
        sleep 2
    done
fi

# Final connection test
echo "🔍 Testing MongoDB connection..."
if test_connection; then
    echo "✅ MongoDB connection successful!"
    echo "🎉 Ready to start MESS WALLAH backend"
    
    # Show MongoDB status
    echo "📊 MongoDB Status:"
    if command -v brew &> /dev/null; then
        brew services list | grep mongodb || echo "   MongoDB service status unknown"
    fi
    echo "   Process: $(pgrep -x mongod | wc -l | xargs) MongoDB process(es) running"
    echo "   Database: mess-wallah"
    echo "   Connection: mongodb://localhost:27017/mess-wallah"
else
    echo "❌ MongoDB connection failed after startup attempts"
    echo ""
    echo "🔧 Manual troubleshooting steps:"
    echo "1. Install MongoDB: brew install mongodb-community"
    echo "2. Start service: brew services start mongodb/brew/mongodb-community"
    echo "3. Check status: brew services list | grep mongodb"
    echo "4. Check logs: tail -f /usr/local/var/log/mongodb/mongo.log"
    echo ""
    echo "🆘 If issues persist:"
    echo "   - Restart MongoDB: brew services restart mongodb/brew/mongodb-community"
    echo "   - Check port 27017: lsof -i :27017"
    echo "   - Manual start: mongod --config /usr/local/etc/mongod.conf"
    exit 1
fi

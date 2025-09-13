#!/bin/bash

# MESS WALLAH - MongoDB Service Manager
# Automatically installs and starts MongoDB for development

echo "🍃 MESS WALLAH MongoDB Service Manager"
echo "======================================"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "📦 MongoDB not found. Installing via Homebrew..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # Install MongoDB
    echo "⬇️  Installing MongoDB Community Edition..."
    brew tap mongodb/brew
    brew install mongodb-community
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install MongoDB"
        exit 1
    fi
    
    echo "✅ MongoDB installed successfully"
fi

# Check if MongoDB service is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is already running"
else
    echo "🚀 Starting MongoDB service..."
    
    # Start MongoDB as a service (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb/brew/mongodb-community
        
        if [ $? -eq 0 ]; then
            echo "✅ MongoDB service started successfully"
        else
            echo "❌ Failed to start MongoDB service"
            echo "🔧 Trying alternative startup method..."
            
            # Alternative: Start mongod directly
            mongod --config /usr/local/etc/mongod.conf --fork
            
            if [ $? -eq 0 ]; then
                echo "✅ MongoDB started successfully"
            else
                echo "❌ Failed to start MongoDB"
                exit 1
            fi
        fi
    else
        # For Linux systems
        sudo systemctl start mongod
        
        if [ $? -eq 0 ]; then
            echo "✅ MongoDB service started successfully"
        else
            echo "❌ Failed to start MongoDB service"
            exit 1
        fi
    fi
fi

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
for i in {1..30}; do
    if mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB is ready and accepting connections"
        echo "🌐 MongoDB running on: mongodb://localhost:27017"
        echo "🗄️  Database: mess-wallah"
        echo ""
        echo "📋 Available commands:"
        echo "   npm run mongo:stop    - Stop MongoDB service"
        echo "   npm run mongo:restart - Restart MongoDB service"
        echo "   npm run mongo:status  - Check MongoDB status"
        exit 0
    fi
    echo "   Attempt $i/30..."
    sleep 2
done

echo "❌ MongoDB failed to start within 60 seconds"
echo "🔧 Troubleshooting steps:"
echo "   1. Check MongoDB logs: tail -f /usr/local/var/log/mongodb/mongo.log"
echo "   2. Check if port 27017 is in use: lsof -i :27017"
echo "   3. Manually start MongoDB: mongod --config /usr/local/etc/mongod.conf"
exit 1

#!/bin/bash

# MESS WALLAH - Project Cleanup Script
# This script stops all running services and cleans up processes

echo "🛑 MESS WALLAH - Stopping All Services"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to kill process on port
kill_port() {
    local port=$1
    local service=$2
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        print_status "Stopping $service on port $port (PID: $pid)"
        kill -TERM $pid 2>/dev/null
        sleep 3
        # Force kill if still running
        if kill -0 $pid 2>/dev/null; then
            print_warning "Force killing $service (PID: $pid)"
            kill -9 $pid 2>/dev/null
        fi
        print_success "$service stopped"
    else
        print_status "$service not running on port $port"
    fi
}

# Stop services using saved PIDs
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_status "Stopping backend server (PID: $BACKEND_PID)"
        kill -TERM $BACKEND_PID 2>/dev/null
        sleep 2
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill -9 $BACKEND_PID 2>/dev/null
        fi
        print_success "Backend server stopped"
    fi
    rm -f .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_status "Stopping frontend server (PID: $FRONTEND_PID)"
        kill -TERM $FRONTEND_PID 2>/dev/null
        sleep 2
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill -9 $FRONTEND_PID 2>/dev/null
        fi
        print_success "Frontend server stopped"
    fi
    rm -f .frontend.pid
fi

# Kill any remaining processes on known ports
kill_port 5001 "Backend Server"
kill_port 5173 "Frontend Server"
kill_port 3000 "Alternative Frontend"

# Clean up log files
print_status "Cleaning up log files..."
rm -f backend.log frontend.log

# Stop MongoDB (optional)
read -p "Do you want to stop MongoDB service? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Stopping MongoDB..."
    if command -v brew &> /dev/null; then
        brew services stop mongodb/brew/mongodb-community
        print_success "MongoDB stopped"
    else
        print_warning "Homebrew not found, cannot stop MongoDB service"
    fi
fi

print_success "All MESS WALLAH services stopped successfully!"
echo ""
echo "To restart the project, run: ./start-project.sh"

#!/bin/bash

# MESS WALLAH - Complete Project Startup Script
# This script starts both backend and frontend with proper error handling

echo "🚀 MESS WALLAH - Starting Complete Project"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Backend or frontend directory not found!"
    exit 1
fi

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        print_warning "Killing process on port $port (PID: $pid)"
        kill -9 $pid
        sleep 2
    fi
}

# Clean up any existing processes
print_status "Cleaning up existing processes..."
kill_port 5001  # Backend
kill_port 5173  # Frontend
kill_port 3000  # Alternative frontend

# Start MongoDB
print_status "Starting MongoDB..."
cd backend
if npm run mongo:start; then
    print_success "MongoDB started successfully"
else
    print_error "Failed to start MongoDB"
    exit 1
fi

# Install backend dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Start backend server in background
print_status "Starting backend server..."
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
print_status "Waiting for backend to start..."
for i in {1..30}; do
    if check_port 5001; then
        print_success "Backend server started on port 5001"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start within 60 seconds"
        print_error "Check backend.log for details"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    echo -n "."
    sleep 2
done

# Test backend health
print_status "Testing backend health..."
if curl -s http://localhost:5001/health > /dev/null; then
    print_success "Backend health check passed"
else
    print_warning "Backend health check failed, but continuing..."
fi

# Start frontend
cd ../frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

print_status "Starting frontend server..."
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
print_status "Waiting for frontend to start..."
for i in {1..20}; do
    if check_port 5173; then
        print_success "Frontend server started on port 5173"
        break
    fi
    if [ $i -eq 20 ]; then
        print_error "Frontend failed to start within 40 seconds"
        print_error "Check frontend.log for details"
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
        exit 1
    fi
    echo -n "."
    sleep 2
done

# Display startup summary
echo ""
echo "🎉 MESS WALLAH Project Started Successfully!"
echo "=========================================="
echo ""
print_success "Backend Server: http://localhost:5001"
print_success "Frontend App: http://localhost:5173"
echo ""
echo "📋 Available Endpoints:"
echo "  • Health Check: http://localhost:5001/health"
echo "  • API Test: http://localhost:5001/api/test"
echo "  • Featured Rooms: http://localhost:5001/api/rooms/featured"
echo "  • All Rooms: http://localhost:5001/api/rooms"
echo ""
echo "📊 Process Information:"
echo "  • Backend PID: $BACKEND_PID"
echo "  • Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Log Files:"
echo "  • Backend: backend.log"
echo "  • Frontend: frontend.log"
echo ""
echo "🛑 To stop all services:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo "  or run: ./stop-project.sh"
echo ""

# Save PIDs for cleanup script
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

print_success "Project is ready! Open http://localhost:5173 in your browser"

# Keep script running and monitor processes
trap 'echo ""; print_status "Shutting down..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

print_status "Monitoring processes... Press Ctrl+C to stop all services"
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died! Check backend.log"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died! Check frontend.log"
        break
    fi
    sleep 5
done

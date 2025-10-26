#!/bin/bash
echo "Starting CarbonDepict Enterprise..."
echo

echo "Starting backend server..."
cd server && npm run dev &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo
echo "CarbonDepict Enterprise is starting..."
echo "Backend: http://localhost:5500"
echo "Frontend: http://localhost:3500"
echo
echo "Press Ctrl+C to stop all services"

# Function to cleanup processes
cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID

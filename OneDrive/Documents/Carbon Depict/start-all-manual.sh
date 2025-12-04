#!/bin/bash
NODE_BIN="/root/.antigravity-server/bin/b31a0ea425328717c6bd1cff12c6755fd3d63a9d/node"

echo "Starting Backend..."
cd server
$NODE_BIN index.js &
BACKEND_PID=$!
cd ..

echo "Starting Frontend..."
$NODE_BIN node_modules/vite/bin/vite.js &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" INT

wait $BACKEND_PID $FRONTEND_PID

#!/bin/bash

# Carbon Depict - View Logs Script

SERVICE=$1
COMPOSE_FILE="docker-compose.yml"

# Check for dev flag
if [ "$2" == "dev" ] || [ "$1" == "dev" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    if [ "$1" == "dev" ]; then
        SERVICE=$2
    fi
fi

echo "📋 Carbon Depict - Service Logs"
echo "================================"
echo ""

if [ -z "$SERVICE" ]; then
    echo "Streaming logs from all services..."
    echo "Press Ctrl+C to exit"
    echo ""
    docker-compose -f $COMPOSE_FILE logs -f --tail=50
else
    echo "Streaming logs from: $SERVICE"
    echo "Press Ctrl+C to exit"
    echo ""
    docker-compose -f $COMPOSE_FILE logs -f --tail=50 $SERVICE
fi

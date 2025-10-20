#!/bin/bash

# Carbon Depict - Stop Services Script

echo "🛑 Stopping Carbon Depict Services"
echo "==================================="

# Check which compose file to use
if [ "$1" == "dev" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    echo "Stopping DEVELOPMENT environment..."
else
    COMPOSE_FILE="docker-compose.yml"
    echo "Stopping PRODUCTION environment..."
fi

# Stop services
docker-compose -f $COMPOSE_FILE down

echo ""
echo "✅ All services stopped"
echo ""
echo "💡 To remove volumes (delete all data), run:"
echo "   docker-compose -f $COMPOSE_FILE down -v"

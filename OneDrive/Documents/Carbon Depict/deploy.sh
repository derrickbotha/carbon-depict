#!/bin/bash

# Carbon Depict - Production Deployment Script

set -e

echo "🚀 Carbon Depict - Production Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo "Please copy .env.example to .env and fill in the values"
    echo "cp .env.example .env"
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
required_vars=("POSTGRES_PASSWORD" "MONGO_PASSWORD" "REDIS_PASSWORD" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [ "${!var}" == "CHANGE_THIS_IN_PRODUCTION" ] || [ "${!var}" == "CHANGE_THIS_TO_A_VERY_STRONG_SECRET_KEY" ]; then
        echo -e "${RED}❌ Error: $var is not set or using default value${NC}"
        echo "Please update .env file with secure values"
        exit 1
    fi
done

echo -e "${GREEN}✓ Environment variables validated${NC}"

# Pull latest images (if using pre-built images)
echo -e "${YELLOW}📦 Pulling latest images...${NC}"
# docker-compose pull

# Build images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose build --no-cache

echo -e "${GREEN}✓ Images built successfully${NC}"

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down

# Start database services first
echo -e "${YELLOW}🗄️  Starting database services...${NC}"
docker-compose up -d postgres mongodb redis

# Wait for databases to be healthy
echo -e "${YELLOW}⏳ Waiting for databases to be ready...${NC}"
sleep 10

# Check database health
echo -e "${YELLOW}🏥 Checking database health...${NC}"
docker-compose ps

# Start backend
echo -e "${YELLOW}🔧 Starting backend API...${NC}"
docker-compose up -d backend

# Wait for backend to be ready
echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
sleep 5

# Start frontend
echo -e "${YELLOW}🎨 Starting frontend application...${NC}"
docker-compose up -d frontend

# Optional: Start nginx reverse proxy
# echo -e "${YELLOW}🌐 Starting nginx reverse proxy...${NC}"
# docker-compose --profile production up -d nginx

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📊 Application Status:"
docker-compose ps
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:${FRONTEND_PORT:-3500}"
echo "   Backend API: http://localhost:${BACKEND_PORT:-5500}"
echo "   API Health: http://localhost:${BACKEND_PORT:-5500}/api/health"
echo ""
echo "📝 Useful Commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   View status:      docker-compose ps"
echo ""
echo -e "${YELLOW}⚠️  Important: Make sure to set up SSL certificates for production${NC}"
echo -e "${YELLOW}⚠️  Configure firewall rules and security groups${NC}"
echo -e "${YELLOW}⚠️  Set up regular database backups${NC}"

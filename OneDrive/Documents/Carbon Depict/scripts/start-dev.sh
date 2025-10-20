#!/bin/bash

# Carbon Depict - Development Environment Startup

echo "🚀 Starting Carbon Depict Development Environment"
echo "=================================================="

# Start development services
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo "✅ Development environment is starting..."
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.dev.yml ps
echo ""
echo "🌐 Access URLs:"
echo "   Frontend (Vite HMR): http://localhost:3500"
echo "   Backend (Nodemon):   http://localhost:5500"
echo "   PostgreSQL:          localhost:5432"
echo "   MongoDB:             localhost:27017"
echo "   Redis:               localhost:6379"
echo ""
echo "📝 Development Features:"
echo "   ✓ Hot Module Replacement (HMR) enabled"
echo "   ✓ Nodemon auto-restart on code changes"
echo "   ✓ Volume mounts for live code updates"
echo "   ✓ Debug-friendly configurations"
echo ""
echo "📖 Useful Commands:"
echo "   View logs:     docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.dev.yml down"
echo "   Restart:       docker-compose -f docker-compose.dev.yml restart"
echo "   Shell access:  docker-compose -f docker-compose.dev.yml exec backend-dev sh"

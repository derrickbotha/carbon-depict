#!/bin/bash

# Carbon Depict - Database Backup Script

set -e

echo "💾 Carbon Depict - Database Backup"
echo "==================================="

# Create backup directory with timestamp
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

echo "📦 Backing up to: $BACKUP_DIR"
echo ""

# Backup PostgreSQL
echo "🗄️  Backing up PostgreSQL..."
docker-compose exec -T postgres pg_dumpall -U carbonuser > "$BACKUP_DIR/postgres_backup.sql"
echo "✅ PostgreSQL backup complete"

# Backup MongoDB
echo "🗄️  Backing up MongoDB..."
docker-compose exec -T mongodb mongodump --username=carbonuser --password=$MONGO_PASSWORD --authenticationDatabase=admin --out=/tmp/mongo_backup
docker cp $(docker-compose ps -q mongodb):/tmp/mongo_backup "$BACKUP_DIR/mongodb_backup"
echo "✅ MongoDB backup complete"

# Compress backups
echo "🗜️  Compressing backups..."
tar -czf "$BACKUP_DIR.tar.gz" -C backups $(basename $BACKUP_DIR)
rm -rf $BACKUP_DIR
echo "✅ Backup compressed"

echo ""
echo "✅ Backup complete!"
echo "📁 Location: $BACKUP_DIR.tar.gz"
echo "📊 Size: $(du -h "$BACKUP_DIR.tar.gz" | cut -f1)"
echo ""
echo "💡 To restore from this backup, run:"
echo "   ./scripts/restore.sh $BACKUP_DIR.tar.gz"

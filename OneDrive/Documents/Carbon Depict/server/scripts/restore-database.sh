#!/bin/bash

# ==============================================
# MongoDB Restore Script for Carbon Depict
# ==============================================
# Restores MongoDB database from a backup
# Usage: ./restore-database.sh <backup-file> [environment]
# Example: ./restore-database.sh ./backups/production/carbondepict_production_20251203_120000.tar.gz production

set -e  # Exit on error

# ==============================================
# CONFIGURATION
# ==============================================

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

BACKUP_FILE=$1
ENVIRONMENT=${2:-development}
TEMP_DIR="./backups/temp_restore"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ==============================================
# FUNCTIONS
# ==============================================

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# ==============================================
# VALIDATION
# ==============================================

echo "=========================================="
echo "  MongoDB Restore - Carbon Depict"
echo "=========================================="
echo ""

# Check arguments
if [ -z "$BACKUP_FILE" ]; then
    print_error "Missing backup file argument"
    echo "Usage: ./restore-database.sh <backup-file> [environment]"
    echo "Example: ./restore-database.sh ./backups/production/carbondepict_production_20251203.tar.gz production"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    print_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if mongorestore is installed
if ! command -v mongorestore &> /dev/null; then
    print_error "mongorestore is not installed"
    echo "Install MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

print_warning "=========================================="
print_warning "  WARNING: This will REPLACE existing data!"
print_warning "=========================================="
print_info "Environment: ${ENVIRONMENT}"
print_info "Backup file: ${BACKUP_FILE}"
echo ""

# Confirmation prompt
read -p "Are you sure you want to restore? This will overwrite existing data! (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    print_info "Restore cancelled"
    exit 0
fi

# ==============================================
# RESTORE PROCESS
# ==============================================

print_info "Starting restore process..."
echo ""

# Create temporary directory
mkdir -p "${TEMP_DIR}"

# Extract backup
print_info "Extracting backup archive..."
tar -xzf "${BACKUP_FILE}" -C "${TEMP_DIR}"

if [ $? -ne 0 ]; then
    print_error "Failed to extract backup archive"
    rm -rf "${TEMP_DIR}"
    exit 1
fi

print_success "Backup extracted"

# Find the backup directory
BACKUP_DIR=$(find "${TEMP_DIR}" -type d -name "carbondepict" | head -n 1)

if [ -z "$BACKUP_DIR" ]; then
    print_error "Could not find carbondepict database in backup"
    rm -rf "${TEMP_DIR}"
    exit 1
fi

# Perform restore
print_info "Restoring database..."
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    # Production restore (requires authentication)
    print_warning "Restoring to PRODUCTION database!"
    sleep 2

    mongorestore \
        --uri="${MONGO_URI}" \
        --db=carbondepict \
        --drop \
        --gzip \
        "${BACKUP_DIR}" \
        2>&1 | while read line; do
            echo "  $line"
        done
else
    # Development restore (local)
    mongorestore \
        --host=localhost \
        --port=27017 \
        --db=carbondepict \
        --drop \
        --gzip \
        "${BACKUP_DIR}" \
        2>&1 | while read line; do
            echo "  $line"
        done
fi

if [ $? -eq 0 ]; then
    print_success "Database restored successfully"
else
    print_error "Restore failed"
    rm -rf "${TEMP_DIR}"
    exit 1
fi

# Cleanup
print_info "Cleaning up temporary files..."
rm -rf "${TEMP_DIR}"
print_success "Cleanup complete"

echo ""
echo "=========================================="
print_success "Restore process completed!"
echo "=========================================="
echo "Database: carbondepict"
echo "Environment: ${ENVIRONMENT}"
echo ""

# Verify restore
print_info "Verifying restore..."
if [ "$ENVIRONMENT" = "production" ]; then
    COLLECTION_COUNT=$(mongosh "${MONGO_URI}" --quiet --eval "db.getCollectionNames().length")
else
    COLLECTION_COUNT=$(mongosh --quiet --eval "use carbondepict; db.getCollectionNames().length")
fi

print_success "Found ${COLLECTION_COUNT} collections in restored database"
echo ""

exit 0

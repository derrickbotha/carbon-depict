#!/bin/bash

# ==============================================
# MongoDB Backup Script for Carbon Depict
# ==============================================
# Creates timestamped backups of the MongoDB database
# Usage: ./backup-database.sh [environment]
# Example: ./backup-database.sh production

set -e  # Exit on error

# ==============================================
# CONFIGURATION
# ==============================================

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
fi

ENVIRONMENT=${1:-development}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/${ENVIRONMENT}"
BACKUP_NAME="carbondepict_${ENVIRONMENT}_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

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
# MAIN SCRIPT
# ==============================================

echo "=========================================="
echo "  MongoDB Backup - Carbon Depict"
echo "=========================================="
echo ""

# Check if mongodump is installed
if ! command -v mongodump &> /dev/null; then
    print_error "mongodump is not installed"
    echo "Install MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

print_info "Environment: ${ENVIRONMENT}"
print_info "Database: carbondepict"
print_info "Backup location: ${BACKUP_PATH}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Perform backup
print_info "Starting backup..."

if [ "$ENVIRONMENT" = "production" ]; then
    # Production backup (requires authentication)
    mongodump \
        --uri="${MONGO_URI}" \
        --db=carbondepict \
        --out="${BACKUP_PATH}" \
        --gzip \
        2>&1 | while read line; do
            echo "  $line"
        done
else
    # Development backup (local)
    mongodump \
        --host=localhost \
        --port=27017 \
        --db=carbondepict \
        --out="${BACKUP_PATH}" \
        --gzip \
        2>&1 | while read line; do
            echo "  $line"
        done
fi

if [ $? -eq 0 ]; then
    print_success "Backup completed successfully"

    # Create archive
    print_info "Creating compressed archive..."
    cd "${BACKUP_DIR}"
    tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"

    if [ $? -eq 0 ]; then
        rm -rf "${BACKUP_NAME}"
        print_success "Archive created: ${BACKUP_NAME}.tar.gz"

        # Get file size
        BACKUP_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
        print_info "Backup size: ${BACKUP_SIZE}"
    else
        print_error "Failed to create archive"
        exit 1
    fi
else
    print_error "Backup failed"
    exit 1
fi

# Clean up old backups (keep last 7)
print_info "Cleaning up old backups (keeping last 7)..."
cd "${BACKUP_DIR}"
ls -t *.tar.gz | tail -n +8 | xargs -r rm --
REMAINING=$(ls -1 *.tar.gz 2>/dev/null | wc -l)
print_success "Old backups cleaned. ${REMAINING} backups remaining."

echo ""
echo "=========================================="
print_success "Backup process completed!"
echo "=========================================="
echo "Backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo ""

# Optional: Upload to cloud storage
if [ "$UPLOAD_TO_S3" = "true" ] && [ -n "$AWS_S3_BACKUP_BUCKET" ]; then
    print_info "Uploading to S3..."
    aws s3 cp "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
        "s3://${AWS_S3_BACKUP_BUCKET}/mongodb/${BACKUP_NAME}.tar.gz"

    if [ $? -eq 0 ]; then
        print_success "Uploaded to S3: ${AWS_S3_BACKUP_BUCKET}/mongodb/${BACKUP_NAME}.tar.gz"
    else
        print_warning "S3 upload failed (backup is still saved locally)"
    fi
fi

exit 0

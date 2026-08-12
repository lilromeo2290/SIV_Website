#!/bin/bash
# ============================================
# SIV Engineering CRM - VPS Deployment Script
# ============================================

APP_DIR="/home/sivcrm/app"
DB_DIR="/home/sivcrm/db"
LOG_DIR="/home/sivcrm/logs"
PORT=3050

echo "========================================="
echo "  SIV Engineering CRM - Deployment"
echo "========================================="

# Step 1: Create directories
echo "[1/7] Creating directories..."
mkdir -p $APP_DIR $DB_DIR $LOG_DIR

# Step 2: Copy env file if not exists
echo "[2/7] Setting up environment..."
if [ ! -f "$APP_DIR/.env" ]; then
    cp .env.production $APP_DIR/.env
    echo "  Created .env file. Review and update if needed."
else
    echo "  .env already exists, skipping."
fi

# Step 3: Install dependencies
echo "[3/7] Installing dependencies..."
npm install --production 2>&1 | tail -3

# Step 4: Generate Prisma client
echo "[4/7] Generating Prisma client..."
npx prisma generate 2>&1 | tail -3

# Step 5: Push database schema
echo "[5/7] Setting up database..."
DATABASE_URL="file:$DB_DIR/crm.db" npx prisma db push --skip-generate 2>&1 | tail -3

# Step 6: Build Next.js
echo "[6/7] Building Next.js application..."
npm run build 2>&1 | tail -5

# Step 7: Restart with PM2
echo "[7/7] Starting application with PM2..."
if command -v pm2 &> /dev/null; then
    pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
    pm2 save
    echo "  PM2 process started/restarted."
else
    echo "  PM2 not found. Starting directly..."
    cd $APP_DIR/.next/standalone
    NODE_ENV=production PORT=$PORT DATABASE_URL="file:$DB_DIR/crm.db" nohup node server.js > $LOG_DIR/out.log 2> $LOG_DIR/error.log &
    echo "  Process started with PID: $!"
fi

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "========================================="
echo ""
echo "  App URL: http://localhost:$PORT"
echo "  App Dir: $APP_DIR"
echo "  DB Dir:  $DB_DIR"
echo "  Logs:    $LOG_DIR"
echo ""
echo "  Next: Configure Nginx reverse proxy"
echo "  Copy nginx-siv.conf to /etc/nginx/conf.d/"
echo "========================================="

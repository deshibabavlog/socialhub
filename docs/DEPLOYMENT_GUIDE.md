# SocialHub Deployment Guide

Complete step-by-step guide for deploying SocialHub to production.

## Prerequisites

- VPS or Cloud Server (AWS, DigitalOcean, Heroku, etc.)
- Domain name with DNS access
- SSL/TLS certificate (Let's Encrypt)
- PostgreSQL 14+
- Redis 7+
- Node.js 18+
- Git

## Architecture Overview

```
Internet
    |
    v
[Load Balancer / Reverse Proxy - Nginx]
    |
    +---> [API Server - Node.js/NestJS] (Port 3000)
    |
    +---> [Web Server - Vite/React] (Port 5173)
    |
    v
[PostgreSQL Database]
[Redis Cache/Queue]
```

## Step-by-Step Deployment

### 1. Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE socialhub;

# Create user
CREATE USER socialhub_user WITH PASSWORD 'strong_password_here';

# Grant privileges
ALTER ROLE socialhub_user SET client_encoding TO 'utf8';
ALTER ROLE socialhub_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE socialhub_user SET default_transaction_deferrable TO on;
ALTER ROLE socialhub_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE socialhub TO socialhub_user;

# Exit psql
\q
```

### 3. Redis Setup

```bash
# Start Redis
sudo systemctl start redis-server

# Enable on boot
sudo systemctl enable redis-server

# Verify
redis-cli ping
# Should return: PONG
```

### 4. Application Deployment

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/socialhub.git
cd socialhub

# Install dependencies
npm install

# Create .env file
sudo nano .env
```

**.env file:**
```env
# API Configuration
NODE_ENV=production
PORT=3000
API_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://socialhub_user:strong_password_here@localhost:5432/socialhub

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=generate-a-random-secure-key-here

# OAuth Credentials
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
TIKTOK_CLIENT_KEY=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
```

### 5. Database Migration

```bash
# Run migrations
npm run db:push

# Verify
npm run db:studio  # Opens database studio (optional)
```

### 6. Build Application

```bash
# Build both frontend and backend
npm run build

# Verify build output
ls -la dist/
```

### 7. Set up PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'socialhub-api',
      script: './dist/main.js',
      cwd: './apps/api',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Make PM2 start on boot
pm2 startup
pm2 save
```

### 8. Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/socialhub
```

**Nginx Configuration:**
```nginx
upstream api {
    server localhost:3000;
}

upstream web {
    server localhost:5173;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # API proxy
    location /api/ {
        proxy_pass http://api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Web frontend
    location / {
        proxy_pass http://web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/socialhub /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 9. SSL Certificate Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 10. Monitoring and Logs

```bash
# View PM2 logs
pm2 logs socialhub-api

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View system logs
sudo journalctl -u redis-server -f
```

## Backup Strategy

### Database Backup

```bash
# Create backup script
cat > /home/ubuntu/backup_db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/socialhub"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
pg_dump -U socialhub_user socialhub | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup_db.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup_db.sh
```

## Performance Optimization

### 1. Database Indexes
Already included in Prisma schema - indexes on frequently queried fields.

### 2. Caching
- Redis caching for OAuth tokens
- Browser caching for static assets (1 year)

### 3. API Optimization
- Pagination for list endpoints
- Field selection with Prisma select
- Connection pooling via Prisma

### 4. Frontend Optimization
- Code splitting with Vite
- Image optimization
- Gzip compression via Nginx

## Scaling Strategy

### Horizontal Scaling
1. Load balance API across multiple servers
2. Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
3. Use managed Redis (Redis Cloud, ElastiCache)
4. Use CDN for static assets (Cloudflare)

### Vertical Scaling
1. Increase server RAM and CPU
2. Optimize database queries
3. Implement Redis caching layer

## Troubleshooting

### API not responding
```bash
pm2 logs socialhub-api
# Check logs for errors
```

### Database connection issues
```bash
psql -U socialhub_user -h localhost -d socialhub
# Verify connection
```

### Redis connection issues
```bash
redis-cli ping
# Should return PONG
```

### Nginx issues
```bash
sudo nginx -t
# Check configuration
sudo systemctl status nginx
```

## Maintenance

### Regular Tasks
- Monitor disk space: `df -h`
- Check database size: `du -sh /var/lib/postgresql`
- Review error logs weekly
- Update dependencies monthly

### Update Process
```bash
cd /var/www/socialhub
git pull origin main
npm install
npm run build
pm2 restart socialhub-api
# Test deployment at yourdomain.com
```

## Security Checklist

- [ ] SSL/TLS certificate installed
- [ ] Firewall rules configured (ufw)
- [ ] SSH key-based authentication enabled
- [ ] Database user has minimal required permissions
- [ ] Environment variables properly secured
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] Log monitoring set up
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented

## Support

For deployment issues, check logs and verify all prerequisites are met.

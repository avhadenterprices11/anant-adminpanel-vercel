# Quick Deployment Guide - Anant Enterprises Admin Panel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Production environment variables configured
- Backend API running and accessible
- Supabase project configured

## 📋 Deployment Steps

### 1. Pre-Deployment Validation

```bash
# Navigate to admin panel directory
cd anant-enterprises-admin

# Install dependencies (if not already installed)
npm install

# Run pre-deployment validation script
./scripts/pre-deployment-check.sh
```

### 2. Configure Environment Variables

Create or update `.env.production`:

```bash
# Copy from example
cp .env.production.example .env.production

# Edit with your production values
nano .env.production
```

**Required Variables:**
```bash
VITE_API_BASE_URL=https://your-api.com/api/v1/
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Anant Enterprises Admin
VITE_APP_VERSION=1.0.0
VITE_STOREFRONT_URL=https://your-storefront.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1/object/public/uploads
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 3. Build for Production

```bash
# Production build
npm run build:prod

# Verify build output
ls -lh dist/

# Optional: Preview locally
npm run preview
```

### 4. Deploy to Hosting Platform

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts to link project
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### Option C: AWS S3 + CloudFront

```bash
# Build
npm run build:prod

# Install AWS CLI (if not installed)
# brew install awscli  # macOS
# sudo apt install awscli  # Linux

# Configure AWS credentials
aws configure

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### Option D: Traditional Server (Nginx)

```bash
# Build locally
npm run build:prod

# Upload dist folder to server
scp -r dist/* user@your-server:/var/www/admin

# Configure Nginx
```

**Nginx Configuration** (`/etc/nginx/sites-available/admin`):
```nginx
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/admin;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 5. Post-Deployment Verification

```bash
# Check site is accessible
curl -I https://admin.yourdomain.com

# Verify security headers
curl -I https://admin.yourdomain.com | grep -i "x-frame-options\|x-content-type\|strict-transport"

# Test API connectivity (from browser console after login)
fetch('https://your-api.com/api/v1/health')
```

## ✅ Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Login functionality works
- [ ] All main features accessible
- [ ] API requests successful
- [ ] Images loading correctly
- [ ] No console errors
- [ ] Security headers present
- [ ] SSL certificate valid
- [ ] Custom domain configured
- [ ] Error monitoring setup
- [ ] Backup procedures in place

## 🔧 Troubleshooting

### Issue: "ReferenceError: Cannot access 'A' before initialization"
**Status**: ✅ FIXED in latest version
**Solution**: Already resolved by updating route imports in App.tsx

### Issue: API requests failing
```bash
# Check environment variables
cat .env.production | grep VITE_API_BASE_URL

# Verify CORS on backend
# Backend should allow: https://admin.yourdomain.com

# Check network tab in browser DevTools
```

### Issue: Images not loading
```bash
# Verify Supabase Storage URL
cat .env.production | grep VITE_SUPABASE_STORAGE_URL

# Check Supabase Storage bucket is public
# Go to: Supabase Dashboard > Storage > uploads > Make public
```

### Issue: White screen after deployment
```bash
# Check browser console for errors
# Common causes:
# 1. Missing environment variables
# 2. Base URL mismatch
# 3. CORS issues

# Verify build output
ls -lh dist/
cat dist/index.html
```

### Issue: 404 on page refresh
**Cause**: Server not configured for SPA routing

**Solution**: Add rewrites/redirects (see hosting configuration above)

## 📊 Monitoring

### Set Up Error Tracking

```bash
# Install Sentry (optional)
npm install @sentry/react @sentry/vite-plugin

# Configure in src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD,
});
```

### Monitor Performance

Use browser DevTools:
- **Network tab**: Check load times
- **Lighthouse**: Run performance audit
- **Console**: Check for errors/warnings

## 🔄 Update Deployment

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run validation
./scripts/pre-deployment-check.sh

# Build and deploy
npm run build:prod

# Deploy based on platform
# Vercel: vercel --prod
# Netlify: netlify deploy --prod --dir=dist
# Others: Follow specific platform instructions
```

## 📞 Support

For deployment issues:
1. Check [Production Readiness Checklist](./PRODUCTION_READINESS_CHECKLIST.md)
2. Review [Security Configuration](./SECURITY_CONFIGURATION.md)
3. Check [Configuration Structure](../instructions/CONFIGURATION_STRUCTURE.md)

## 🆘 Emergency Rollback

If deployment causes issues:

```bash
# Vercel
vercel rollback

# Netlify
netlify deploy --alias=previous-working-version

# Traditional server
ssh user@server
cd /var/www/admin
git checkout previous-commit
npm install
npm run build:prod
```

---

**Last Updated**: February 2026
**Version**: 1.0

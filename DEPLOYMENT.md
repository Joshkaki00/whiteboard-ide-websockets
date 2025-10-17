# Deployment Guide

## Architecture

- **Frontend**: React + Vite → GitHub Pages
- **Backend**: Node.js + Express + Socket.IO → Fly.io
- **Real-time**: WebSocket connections with fallback to polling

## Frontend Deployment (GitHub Pages)

### Manual Deployment
```bash
npm run deploy
```

This will:
1. Build the React app with Vite
2. Deploy to GitHub Pages using `gh-pages` package
3. Make the app available at your GitHub Pages URL

### Environment Variables
Set in your build environment or `.env.production`:
```
VITE_SERVER_URL=https://whiteboard-ide-websockets.fly.dev
```

### Build Settings
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

## Backend Deployment (Fly.io)

### Prerequisites
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login
```

### Initial Setup
```bash
# Launch app (if not already created)
flyctl launch

# Set environment variables
flyctl secrets set CORS_ORIGIN=https://your-github-pages-url.io
```

### Deploy
```bash
# Build and deploy
flyctl deploy

# Or use npm script
npm run deploy:server
```

### Server Management

Check status:
```bash
npm run server:status
# or
flyctl status
```

View logs:
```bash
npm run server:logs
# or
flyctl logs
```

Scale servers (if needed):
```bash
# Stop
npm run server:stop

# Start
npm run server:start
```

### Environment Variables
```
CORS_ORIGIN=https://your-frontend-url.io
PORT=8080  # Fly.io default
```

## CI/CD (Optional)

### GitHub Actions for Frontend

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_SERVER_URL: https://whiteboard-ide-websockets.fly.dev
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Fly.io Auto-Deploy

Add to `fly.toml`:
```toml
[deploy]
  release_command = "echo 'Deploying...'"
```

Connect your GitHub repo in Fly.io dashboard for auto-deploys on push.

## Monitoring

### Health Checks
- Frontend: Check GitHub Pages availability
- Backend: `https://whiteboard-ide-websockets.fly.dev/health`

### Analytics
Access via API endpoints:
- `GET /api/analytics/stats` - Usage statistics
- `GET /api/feedback/all` - User feedback

### Logs
```bash
# Real-time logs
flyctl logs

# Tail logs
flyctl logs -a whiteboard-ide-websockets
```

## Scaling

### Backend Scaling
```bash
# Scale to 2 instances
flyctl scale count 2

# Scale to different regions
flyctl regions add sea lax
```

### Frontend Scaling
GitHub Pages automatically scales with CDN.

## Costs

- **Frontend**: Free (GitHub Pages)
- **Backend**: ~$5-15/month (Fly.io)
  - 1 shared CPU instance
  - 256MB RAM
  - Always-on configuration

## Rollback

### Frontend
```bash
# Checkout previous commit
git checkout HEAD~1

# Redeploy
npm run deploy
```

### Backend
```bash
# List releases
flyctl releases

# Rollback to previous
flyctl releases rollback
```

## Troubleshooting

### CORS Issues
- Ensure `CORS_ORIGIN` is set correctly on backend
- Check that frontend is using correct `VITE_SERVER_URL`
- Verify both HTTP and HTTPS match

### Connection Timeouts
- Check Fly.io status: `flyctl status`
- Verify health endpoint is responding
- Increase timeout settings in `server/index.ts`

### Build Failures
- Clear cache: `npm run build -- --force`
- Delete `node_modules` and reinstall
- Check Node.js version compatibility

## Security

- Always use HTTPS in production
- Set strong CORS policies
- Don't commit `.env` files
- Use Fly.io secrets for sensitive data
- Regularly update dependencies

## Performance Optimization

### Frontend
- Code splitting enabled by default (Vite)
- Lazy load components where possible
- Optimize images and assets

### Backend
- Enable gzip compression
- Use connection pooling
- Monitor memory usage
- Implement rate limiting if needed

## Backup

Analytics and feedback data are stored in:
- `server/data/analytics.jsonl`
- `server/data/feedback.json`

Backup strategy:
```bash
# Download data from Fly.io
flyctl ssh console
cd /app/data
cat analytics.jsonl > /tmp/analytics-backup.jsonl
# Copy to local machine
```

---

Last updated: October 2025

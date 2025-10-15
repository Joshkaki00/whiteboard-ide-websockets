# 🚀 Deploy to Fly.io RIGHT NOW

## Quick Commands (Copy-Paste)

### 1. Set the CORS Secret
```bash
flyctl secrets set CORS_ORIGIN="https://joshkaki00.github.io" -a whiteboard-ide-websockets
```

### 2. Deploy
```bash
flyctl deploy -a whiteboard-ide-websockets
```

### 3. Verify It Works
```bash
curl https://whiteboard-ide-websockets.fly.dev/health
```

Should return:
```json
{"status":"healthy","uptime":123.45,"timestamp":"...","rooms":0}
```

---

## Then Update Frontend

### 1. Create `.env.production` file:
```bash
echo "VITE_SERVER_URL=https://whiteboard-ide-websockets.fly.dev" > .env.production
```

### 2. Commit and push:
```bash
git add .env.production Dockerfile fly.toml .dockerignore FLY_DEPLOY.md DEPLOY_NOW.md package.json
git commit -m "Deploy backend to Fly.io"
git push origin main
```

### 3. Wait 2 minutes for GitHub Actions, then test:
Open: `https://joshkaki00.github.io/whiteboard-ide-websockets/`

---

## Troubleshooting

### If deploy fails, check logs:
```bash
flyctl logs -a whiteboard-ide-websockets
```

### If you see "app crashing", the issue is usually:
1. **Missing CORS secret** - Run step 1 above
2. **Wrong port** - Already fixed in fly.toml (port 8080)
3. **tsx not found** - Already fixed in package.json (moved to dependencies)

### Common fixes:
```bash
# Restart the app
flyctl apps restart whiteboard-ide-websockets

# Check status
flyctl status -a whiteboard-ide-websockets

# View real-time logs
flyctl logs -a whiteboard-ide-websockets -f
```

---

## What I Fixed For You

1. ✅ Created `fly.toml` with correct configuration
2. ✅ Created `Dockerfile` optimized for Fly.io
3. ✅ Created `.dockerignore` to exclude frontend files
4. ✅ Moved `tsx` from devDependencies to dependencies
5. ✅ Added `start` script to package.json
6. ✅ Server already uses `process.env.PORT` (no changes needed)
7. ✅ Server already uses `process.env.CORS_ORIGIN` (no changes needed)

---

## Your App URLs

**Backend**: `https://whiteboard-ide-websockets.fly.dev`
**Frontend**: `https://joshkaki00.github.io/whiteboard-ide-websockets/`
**Health Check**: `https://whiteboard-ide-websockets.fly.dev/health`

---

## That's It!

Just run those 2 commands and you're live! 🚀


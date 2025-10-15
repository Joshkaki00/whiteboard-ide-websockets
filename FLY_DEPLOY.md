# 🚀 Fly.io Deployment Guide for CodePair Backend

## Quick Deploy Steps

### 1. Set Secrets (Environment Variables)

```bash
flyctl secrets set CORS_ORIGIN="https://joshkaki00.github.io" -a whiteboard-ide-websockets
```

### 2. Deploy

```bash
flyctl deploy -a whiteboard-ide-websockets
```

That's it! Your backend will be live at: `https://whiteboard-ide-websockets.fly.dev`

---

## Detailed Setup (First Time)

### Prerequisites
- Fly.io account created
- `flyctl` CLI installed
- Logged in: `flyctl auth login`

### Initial Setup

1. **Set the CORS Origin Secret**
   ```bash
   flyctl secrets set CORS_ORIGIN="https://joshkaki00.github.io" -a whiteboard-ide-websockets
   ```

2. **Deploy**
   ```bash
   flyctl deploy -a whiteboard-ide-websockets
   ```

3. **Check Status**
   ```bash
   flyctl status -a whiteboard-ide-websockets
   ```

4. **View Logs**
   ```bash
   flyctl logs -a whiteboard-ide-websockets
   ```

---

## Configuration Files

All configuration files are already created:

### `fly.toml`
- App name and region
- Port 8080 (Fly.io standard)
- Health check at `/health`
- Auto-stop/start for cost savings
- 256MB RAM (enough for Socket.IO)

### `Dockerfile`
- Node.js 20 Alpine (lightweight)
- Multi-stage build
- Production dependencies only
- Uses `tsx` to run TypeScript directly

### `.dockerignore`
- Excludes frontend code
- Excludes dev files
- Keeps only server code

---

## Verify Deployment

### 1. Health Check
```bash
curl https://whiteboard-ide-websockets.fly.dev/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2025-10-15T...",
  "rooms": 0
}
```

### 2. Check Logs
```bash
flyctl logs -a whiteboard-ide-websockets
```

Should see:
```
Server running on port 8080
```

### 3. Test Socket.IO Connection
Open browser console at `https://joshkaki00.github.io/whiteboard-ide-websockets/`:
- Should see: "Connected to server"
- No CORS errors

---

## Update Frontend

After backend is deployed, update your frontend:

1. **Update `.env.production`**
   ```bash
   VITE_SERVER_URL=https://whiteboard-ide-websockets.fly.dev
   ```

2. **Commit and push**
   ```bash
   git add .env.production
   git commit -m "Connect to Fly.io backend"
   git push origin main
   ```

3. **Wait for GitHub Actions** (~2 minutes)

4. **Test at**: `https://joshkaki00.github.io/whiteboard-ide-websockets/`

---

## Troubleshooting

### Issue: App crashes on startup

**Check logs:**
```bash
flyctl logs -a whiteboard-ide-websockets
```

**Common fixes:**
- Ensure `CORS_ORIGIN` secret is set
- Verify Dockerfile is correct
- Check server code runs locally

### Issue: CORS errors

**Solution:**
```bash
# Update CORS origin (no trailing slash!)
flyctl secrets set CORS_ORIGIN="https://joshkaki00.github.io" -a whiteboard-ide-websockets
```

### Issue: WebSocket connection fails

**Check:**
- Health endpoint works: `curl https://whiteboard-ide-websockets.fly.dev/health`
- Fly.io supports WebSockets by default
- No firewall blocking connections

### Issue: Build fails

**Solution:**
```bash
# Test Docker build locally
docker build -t test .

# If it works, deploy again
flyctl deploy -a whiteboard-ide-websockets
```

---

## Fly.io Commands Reference

```bash
# Deploy
flyctl deploy -a whiteboard-ide-websockets

# View logs
flyctl logs -a whiteboard-ide-websockets

# Real-time logs
flyctl logs -a whiteboard-ide-websockets -f

# Check status
flyctl status -a whiteboard-ide-websockets

# Set secrets
flyctl secrets set KEY=value -a whiteboard-ide-websockets

# List secrets
flyctl secrets list -a whiteboard-ide-websockets

# SSH into machine
flyctl ssh console -a whiteboard-ide-websockets

# Scale machines
flyctl scale count 1 -a whiteboard-ide-websockets

# Monitor
flyctl monitor -a whiteboard-ide-websockets
```

---

## Cost & Performance

### Free Tier
- 3 shared-cpu-1x VMs with 256MB RAM
- 160GB outbound data transfer
- **Perfect for this app!**

### Performance
- **Region**: San Jose (sjc) - change in `fly.toml` if needed
- **Cold start**: ~2-3 seconds
- **Auto-stop**: After inactivity (saves resources)
- **Auto-start**: On next request

### Keep Alive (Optional)
Prevent cold starts with a cron job:

```bash
# Ping every 10 minutes
*/10 * * * * curl https://whiteboard-ide-websockets.fly.dev/health
```

Or use [UptimeRobot](https://uptimerobot.com) (free).

---

## Update Deployment

When you make changes:

```bash
# 1. Commit changes to git
git add .
git commit -m "Update server code"
git push

# 2. Deploy to Fly.io
flyctl deploy -a whiteboard-ide-websockets

# 3. Verify
flyctl logs -a whiteboard-ide-websockets
```

---

## Multiple Environments (Optional)

### Staging Environment
```bash
# Create staging app
flyctl apps create whiteboard-ide-websockets-staging

# Copy fly.toml to fly.staging.toml
cp fly.toml fly.staging.toml

# Edit fly.staging.toml: change app name

# Set secrets
flyctl secrets set CORS_ORIGIN="http://localhost:5173" -a whiteboard-ide-websockets-staging

# Deploy
flyctl deploy -a whiteboard-ide-websockets-staging -c fly.staging.toml
```

---

## Monitoring & Alerts

### View Metrics
```bash
flyctl dashboard -a whiteboard-ide-websockets
```

Or visit: https://fly.io/apps/whiteboard-ide-websockets/monitoring

### Set Up Alerts
1. Go to Fly.io dashboard
2. Select app
3. Settings > Alerts
4. Add email/Slack alerts for:
   - Machine crashes
   - High memory usage
   - HTTP errors

---

## Custom Domain (Optional)

### Add Your Domain

1. **Add certificate**
   ```bash
   flyctl certs create yourdomain.com -a whiteboard-ide-websockets
   ```

2. **Add DNS records** (at your domain registrar)
   ```
   CNAME @ whiteboard-ide-websockets.fly.dev
   ```

3. **Update CORS**
   ```bash
   flyctl secrets set CORS_ORIGIN="https://yourdomain.com" -a whiteboard-ide-websockets
   ```

4. **Update frontend `.env.production`**
   ```
   VITE_SERVER_URL=https://yourdomain.com
   ```

---

## Backup & Recovery

### Export App Config
```bash
flyctl config show -a whiteboard-ide-websockets > backup-fly.toml
```

### Restore
```bash
flyctl deploy -a whiteboard-ide-websockets -c backup-fly.toml
```

---

## Support

- **Fly.io Docs**: https://fly.io/docs
- **Community**: https://community.fly.io
- **Status**: https://status.fly.io

---

## Next Steps

1. ✅ Set CORS secret
2. ✅ Deploy to Fly.io
3. ✅ Verify health endpoint
4. ✅ Update frontend `.env.production`
5. ✅ Test production app
6. ✅ Share with users!

**Your backend will be live at**: `https://whiteboard-ide-websockets.fly.dev` 🚀


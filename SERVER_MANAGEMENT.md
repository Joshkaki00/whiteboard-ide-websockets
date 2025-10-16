# Server Management Guide

This document explains how to manage your Fly.io production server to save costs when not in use.

## Quick Commands

### Check Server Status
```bash
npm run server:status
```
Shows if the server is running, stopped, and current resource usage.

### Stop Server (Save Money!)
```bash
npm run server:stop
```
Stops the server by scaling to 0 machines. **No charges while stopped.**

### Start Server
```bash
npm run server:start
```
Starts the server by scaling to 1 machine.

### View Server Logs
```bash
npm run server:logs
```
Stream real-time logs from the production server.

## Typical Workflow

### Before Development/Testing
```bash
# 1. Check if server is running
npm run server:status

# 2. If stopped, start it
npm run server:start

# 3. Wait ~30 seconds for server to boot
# Then your published site will work at:
# https://devgupta0408.github.io/fall-2025-intensive/
```

### After Development/Testing
```bash
# Stop the server to avoid charges
npm run server:stop
```

## Cost Savings

- **Running**: ~$5-10/month (depending on usage)
- **Stopped**: **$0/month** ✅

By stopping the server when not in use, you can save significant costs!

## Alternative: Use Fly.io CLI Directly

If you prefer using `flyctl` directly:

```bash
# Check status
flyctl status

# Stop (scale to 0)
flyctl scale count 0

# Start (scale to 1)
flyctl scale count 1

# View logs
flyctl logs

# SSH into server
flyctl ssh console

# Check app info
flyctl info
```

## Monitoring

Your server has a health check endpoint at:
- `https://whiteboard-ide-websockets.fly.dev/health`

You can check it in your browser to see if the server is running.

## Troubleshooting

### Server not responding after start?
Wait 30-60 seconds for cold start, then check logs:
```bash
npm run server:logs
```

### Need to restart the server?
```bash
npm run server:stop
# Wait 10 seconds
npm run server:start
```

### Deploy new version?
```bash
cd /Volumes/T9/dev/fall-2025-intensive
flyctl deploy
```


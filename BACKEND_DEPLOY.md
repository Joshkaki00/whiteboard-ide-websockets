# 🚀 Backend Deployment Quick Guide

Your frontend is ready on GitHub Pages. Now let's deploy the backend in 10 minutes!

---

## Option 1: Railway (Recommended - Easiest)

### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. No credit card required for free tier

### Step 2: Deploy
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `whiteboard-ide-websockets`
4. Railway auto-detects Node.js

### Step 3: Configure
1. Click on your service
2. Go to **"Variables"** tab
3. Add these environment variables:
   ```
   CORS_ORIGIN=https://joshkaki00.github.io
   PORT=3001
   ```

### Step 4: Set Start Command
1. Go to **"Settings"** tab
2. Scroll to **"Start Command"**
3. Set to: `tsx server/index.ts`
4. Or set build command: `npm install` and start: `npm run dev:server`

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Copy your Railway URL (e.g., `https://yourapp.railway.app`)

### Step 6: Update Frontend
1. In your repo, update `.env.production`:
   ```
   VITE_SERVER_URL=https://yourapp.railway.app
   ```
2. Commit and push:
   ```bash
   git add .env.production
   git commit -m "Add production backend URL"
   git push origin main
   ```
3. GitHub Actions will auto-deploy

### Done! 🎉
Test at: `https://joshkaki00.github.io/whiteboard-ide-websockets/`

---

## Option 2: Render.com (Free Tier)

### Step 1: Sign Up
1. Go to [render.com](https://render.com)
2. Sign in with GitHub

### Step 2: Create Web Service
1. Click **"New +"** > **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `codepair-server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `tsx server/index.ts`

### Step 3: Environment Variables
Add in "Environment" section:
```
CORS_ORIGIN=https://joshkaki00.github.io
PORT=3001
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (~5 minutes)
3. Copy your Render URL

### Step 5: Update Frontend
Same as Railway Step 6 above.

---

## Option 3: Vercel (Serverless)

**Note**: Socket.IO works differently on serverless. Only use if you understand serverless limitations.

### Quick Deploy
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Create `vercel.json`:
   ```json
   {
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server/index.ts"
       }
     ]
   }
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

4. Set environment variables in Vercel dashboard

---

## Option 4: Heroku (No Free Tier)

### Quick Deploy
1. Install Heroku CLI:
   ```bash
   brew install heroku/brew/heroku
   ```

2. Login and create app:
   ```bash
   heroku login
   heroku create codepair-server
   ```

3. Create Procfile:
   ```
   web: tsx server/index.ts
   ```

4. Set environment variables:
   ```bash
   heroku config:set CORS_ORIGIN=https://joshkaki00.github.io
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

---

## Verification Checklist

After deployment, verify:

### 1. Health Check
```bash
curl https://your-backend-url.com/health
```

Should return:
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2025-10-15T12:00:00.000Z",
  "rooms": 0
}
```

### 2. CORS Check
Open browser console on your GitHub Pages site and check for:
- ✅ No CORS errors
- ✅ Socket.IO connection successful
- ✅ "Connected to server" message

### 3. Functionality Test
1. Create a room
2. Open another browser
3. Join the room
4. Test:
   - ✅ Chat messages sync
   - ✅ Code edits sync
   - ✅ Language switching works
   - ✅ Timer syncs

---

## Troubleshooting

### Issue: CORS Error
**Solution**: Make sure `CORS_ORIGIN` exactly matches your GitHub Pages URL (no trailing slash):
```
CORS_ORIGIN=https://joshkaki00.github.io
```

### Issue: Cannot connect to Socket.IO
**Solution**: 
1. Check if backend is running (visit `/health` endpoint)
2. Verify WebSocket support on your hosting platform
3. Check browser console for errors

### Issue: 404 Not Found
**Solution**: Make sure start command is correct:
```
tsx server/index.ts
```

### Issue: Build fails
**Solution**: Add these to `package.json` dependencies (not devDependencies):
```json
{
  "dependencies": {
    "express": "^5.1.0",
    "socket.io": "^4.8.1",
    "cors": "^2.8.5"
  }
}
```

---

## Free Tier Limits

### Railway
- 500 hours/month
- $5 free credits
- Unlimited projects
- Auto-sleeps after inactivity

### Render
- 750 hours/month
- Sleeps after 15 min inactivity
- 3 free web services
- Restarts on request

### Vercel
- 100GB bandwidth/month
- Serverless functions
- Instant global deployment
- Best for low traffic

---

## Pro Tips

### 1. Keep Backend Awake
Free tier backends sleep after inactivity. Use cron job to ping every 10 minutes:

```bash
# Add to cron (crontab -e)
*/10 * * * * curl https://your-backend-url.com/health > /dev/null 2>&1
```

Or use [UptimeRobot](https://uptimerobot.com) (free).

### 2. Monitor Logs
- **Railway**: Built-in logs in dashboard
- **Render**: Logs tab in service view
- **Heroku**: `heroku logs --tail`

### 3. Custom Domain (Optional)
- Buy domain from Namecheap (~$10/year)
- Point to your backend URL
- Update `CORS_ORIGIN` to your custom domain

---

## What's Next?

After backend is deployed:

1. ✅ Test all features on production
2. ✅ Share your app with friends
3. ✅ Post on social media
4. ✅ Add to your portfolio
5. ✅ Start getting user feedback

---

## Support

If you run into issues:
1. Check platform-specific documentation
2. Review error logs in dashboard
3. Verify environment variables
4. Test health endpoint
5. Open GitHub issue if needed

---

**You're one deployment away from having a live, production-ready app!** 🚀

Choose your platform, follow the steps, and launch! 🎉


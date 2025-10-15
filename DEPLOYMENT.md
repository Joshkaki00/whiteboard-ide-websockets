# 🚀 CodePair Deployment Guide

This guide covers deploying CodePair to production using GitHub Pages for the frontend and various options for the backend.

## 📋 Table of Contents

1. [Frontend Deployment (GitHub Pages)](#frontend-deployment)
2. [Backend Deployment Options](#backend-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Post-Deployment Steps](#post-deployment)

---

## 🎨 Frontend Deployment (GitHub Pages)

### Automatic Deployment via GitHub Actions

The project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

#### Setup Steps:

1. **Enable GitHub Pages in Repository Settings**
   - Go to your repository on GitHub
   - Navigate to `Settings` > `Pages`
   - Under "Build and deployment":
     - Source: Select `GitHub Actions`
   - Save

2. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Monitor Deployment**
   - Go to `Actions` tab in your GitHub repository
   - Watch the deployment workflow
   - Once complete, your site will be live at:
     `https://joshkaki00.github.io/whiteboard-ide-websockets/`

### Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
npm run deploy
```

This will build and deploy to the `gh-pages` branch.

---

## 🖥️ Backend Deployment Options

The Socket.IO backend needs to be deployed separately. Here are your options:

### Option 1: Railway.app (Recommended - Free Tier)

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect it's a Node.js project

3. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `tsx server/index.ts`

4. **Add Environment Variables**
   - Go to your service settings
   - Add variable:
     ```
     CORS_ORIGIN=https://joshkaki00.github.io
     PORT=3001
     ```

5. **Deploy**
   - Railway will auto-deploy
   - Copy the generated URL (e.g., `https://yourapp.railway.app`)

6. **Update Frontend Environment**
   - Create `.env.production` in your repo:
     ```
     VITE_SERVER_URL=https://yourapp.railway.app
     ```
   - Commit and push to redeploy frontend

### Option 2: Render.com (Free Tier)

1. **Sign up at [Render.com](https://render.com)**

2. **Create New Web Service**
   - Click "New +" > "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `codepair-server`
     - Root Directory: Leave blank
     - Runtime: `Node`
     - Build Command: `npm install`
     - Start Command: `tsx server/index.ts`

3. **Add Environment Variables**
   ```
   CORS_ORIGIN=https://joshkaki00.github.io
   PORT=3001
   ```

4. **Deploy & Update Frontend**
   - Copy the Render URL
   - Update `.env.production` with the URL
   - Redeploy frontend

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create codepair-server
   ```

4. **Create Procfile**
   Create `Procfile` in project root:
   ```
   web: tsx server/index.ts
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set CORS_ORIGIN=https://joshkaki00.github.io
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: Self-Hosted VPS (DigitalOcean, AWS, etc.)

1. **Provision a Server**
   - Get a VPS with Node.js 20+
   - SSH into your server

2. **Clone Repository**
   ```bash
   git clone https://github.com/Joshkaki00/whiteboard-ide-websockets.git
   cd whiteboard-ide-websockets
   npm install
   ```

3. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

4. **Create Environment File**
   ```bash
   # Create server/.env
   PORT=3001
   CORS_ORIGIN=https://joshkaki00.github.io
   ```

5. **Start Server with PM2**
   ```bash
   pm2 start tsx --name codepair-server -- server/index.ts
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🔧 Environment Configuration

### Frontend Environment Variables

Create these files (already gitignored):

**`.env.development`**
```bash
VITE_SERVER_URL=http://localhost:3001
```

**`.env.production`**
```bash
VITE_SERVER_URL=https://your-backend-url.com
```

### Backend Environment Variables

**Development** (server/.env)
```bash
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

**Production** (server/.env or platform environment variables)
```bash
PORT=3001
CORS_ORIGIN=https://joshkaki00.github.io
```

---

## ✅ Post-Deployment Steps

### 1. Test the Deployment

Visit your GitHub Pages URL:
```
https://joshkaki00.github.io/whiteboard-ide-websockets/
```

Check:
- ✅ Page loads correctly
- ✅ Connection status shows "Connected to server"
- ✅ Can create/join rooms
- ✅ Real-time chat works
- ✅ Code editor syncs
- ✅ Whiteboard works
- ✅ Timer functions properly

### 2. Monitor Backend Health

Check backend health endpoint:
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

### 3. Load Testing

Run load tests against your production backend:

```bash
# Install dependencies
npm install

# Run load test
SERVER_URL=https://your-backend-url.com npm run loadtest
```

Review results and ensure server handles load well.

### 4. Set Up Monitoring (Optional)

**For Railway/Render:**
- Built-in monitoring in dashboard
- Check logs for errors
- Set up alerts

**For Self-Hosted:**
- Use PM2 monitoring: `pm2 monit`
- Set up log rotation
- Configure uptime monitoring (UptimeRobot, Pingdom)

### 5. Share Your App! 🎉

Your app is now live at:
- **Frontend**: `https://joshkaki00.github.io/whiteboard-ide-websockets/`
- **Backend**: `https://your-backend-url.com`

Share with friends, colleagues, and on social media!

---

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: Styles not loading
- **Solution**: Clear browser cache, check Tailwind CSS is building correctly

**Problem**: Can't connect to backend
- **Solution**: Verify `VITE_SERVER_URL` is set correctly and backend is running

### Backend Issues

**Problem**: CORS errors
- **Solution**: Ensure `CORS_ORIGIN` matches your frontend URL exactly (no trailing slash)

**Problem**: Server crashes
- **Solution**: Check logs for errors, ensure Node.js version is 20+

**Problem**: WebSocket connection fails
- **Solution**: Ensure your hosting platform supports WebSockets (most do)

### GitHub Pages Issues

**Problem**: 404 on page refresh
- **Solution**: GitHub Pages handles this automatically with the `base` path in vite.config.ts

**Problem**: Assets not loading
- **Solution**: Verify `base` in vite.config.ts matches your repo name

---

## 📊 Performance Tips

1. **Enable Compression** on backend (gzip)
2. **Use CDN** for static assets (already handled by GitHub Pages)
3. **Set up Redis** for room persistence (optional upgrade)
4. **Monitor memory usage** on backend
5. **Implement rate limiting** to prevent abuse

---

## 🔐 Security Considerations

1. **HTTPS Only**: Both frontend and backend should use HTTPS in production
2. **CORS Configuration**: Keep `CORS_ORIGIN` restrictive
3. **Rate Limiting**: Add rate limiting to prevent abuse (see server/index.ts)
4. **Input Validation**: Validate all user inputs
5. **Room Limits**: Consider limiting number of concurrent rooms

---

## 📝 Maintenance

### Updating the App

1. Make changes locally
2. Test thoroughly with `npm run dev`
3. Commit changes
4. Push to main branch
5. GitHub Actions will auto-deploy frontend
6. Backend will auto-deploy if connected to GitHub (Railway/Render)

### Monitoring Costs

- **GitHub Pages**: Free for public repos
- **Railway**: Free tier includes 500 hours/month
- **Render**: Free tier with limitations
- **Heroku**: No longer has free tier
- **VPS**: Varies by provider ($5-20/month typical)

---

## 🎯 Next Steps

Now that you're deployed:

1. ✅ Get feedback from real users
2. ✅ Monitor performance and errors
3. ✅ Add analytics (Google Analytics, Mixpanel)
4. ✅ Implement feature requests
5. ✅ Scale as needed

**Congratulations! Your CodePair app is live! 🚀**


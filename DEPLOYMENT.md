# Deployment Guide — Vercel + Render

This guide walks you through deploying your Smart Link Shortener to production.

## Overview

- **Frontend** → Vercel (free tier available)
- **Backend** → Render (free tier available)
- **Database** → JSON file on backend (persists across restarts)

Total cost: **$0/month** on free tiers (with limitations).

## Part 1: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **GitHub** and authorize Vercel

### Step 2: Import Your Project

1. Click **Add New** → **Project**
2. Select your `smart-link-shortener` repository
3. Vercel auto-detects it's a Vite project
4. Click **Deploy**

Vercel will build and deploy automatically. You'll get a URL like:
```
https://smart-link-shortener.vercel.app
```

### Step 3: Configure Environment Variables

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://smart-link-shortener-api.onrender.com` (we'll get this after deploying backend)
   - **Environments:** Production, Preview, Development
4. Click **Save**

### Step 4: Redeploy with Environment Variables

1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Select **Redeploy**

Your frontend is now live! ✅

## Part 2: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Sign Up**
3. Choose **GitHub** and authorize Render

### Step 2: Create Web Service

1. Click **New +** → **Web Service**
2. Select your `smart-link-shortener` repository
3. Configure the service:
   - **Name:** `smart-link-shortener-api`
   - **Environment:** `Node`
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
   - **Plan:** Free (or Starter for production)
4. Click **Create Web Service**

Render will build and deploy. You'll get a URL like:
```
https://smart-link-shortener-api.onrender.com
```

### Step 3: Configure Environment Variables (Optional)

1. Go to your service in Render
2. Click **Environment**
3. Add (optional):
   - **SHORT_DOMAIN:** `https://smart-link-shortener-api.onrender.com`
   - **PORT:** `3000`
4. Click **Save**

Your backend is now live! ✅

## Part 3: Wire Frontend & Backend

### Step 1: Update Frontend Environment Variable

Go back to Vercel and update `VITE_API_URL`:
- **Value:** `https://smart-link-shortener-api.onrender.com`

### Step 2: Redeploy Frontend

1. Go to **Deployments** in Vercel
2. Click the three dots on the latest deployment
3. Select **Redeploy**

### Step 3: Test the Connection

1. Visit your Vercel frontend URL
2. Try shortening a URL
3. Check browser console (F12) for errors
4. If successful, you should see the short link appear

## Part 4: Troubleshooting

### Issue 1: CORS Errors

**Error:** `Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Solution:** Update `server/index.ts` to allow your frontend domain:

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
```

Add environment variable in Render:
- **FRONTEND_URL:** `https://smart-link-shortener.vercel.app`

Then redeploy the backend.

### Issue 2: Render Cold Starts

**Problem:** Render's free tier spins down after 15 minutes of inactivity. First request takes 30+ seconds.

**Solution:** This is expected on free tier. For production:
- Upgrade to Starter plan ($7/month) for always-on instances
- Or use a service like [Railway](https://railway.app) or [Fly.io](https://fly.io)

### Issue 3: Environment Variables Not Loading

**Problem:** Backend can't access environment variables.

**Solution:**
1. Verify variables are set in Render dashboard
2. Redeploy the service
3. Check logs: **Render Dashboard → Logs**

### Issue 4: 404 on Redirect

**Problem:** Visiting `yourdomain.com/abc123` returns 404 instead of redirecting.

**Solution:** Make sure the backend is reachable. Check:
1. `VITE_API_URL` is set correctly in Vercel
2. Backend service is running in Render (check status)
3. No CORS errors in browser console

### Issue 5: Database File Not Persisting

**Problem:** Links disappear after server restart.

**Solution:** This is expected on free tier. Render restarts services periodically. For production:
1. Upgrade to paid plan for persistent storage
2. Or migrate to a real database (PostgreSQL, MongoDB)

## Part 5: Custom Domain Setup

### Option 1: Use Vercel's Domain Registration

1. Go to Vercel project settings
2. Click **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `myshortener.com`)
5. Follow DNS setup instructions

### Option 2: Use Your Existing Domain

If you already own a domain:

**For frontend (Vercel):**
1. Go to Vercel project settings → **Domains**
2. Add your domain
3. Update DNS records to point to Vercel

**For backend (Render):**
1. Go to Render service settings → **Custom Domain**
2. Add a subdomain (e.g., `api.myshortener.com`)
3. Update DNS records

### Option 3: Use Subdomains

- Frontend: `myshortener.com` → Vercel
- Backend: `api.myshortener.com` → Render

## Part 6: Monitoring & Maintenance

### Check Deployment Status

**Vercel:**
- Dashboard shows build status and deployment history
- Green checkmark = successful deployment

**Render:**
- Dashboard shows service status
- Green "Live" badge = running

### View Logs

**Vercel:**
1. Go to **Deployments**
2. Click deployment
3. Click **Logs**

**Render:**
1. Go to service
2. Click **Logs**

### Redeploy After Code Changes

Push new code to GitHub, and both services will automatically redeploy:

```bash
git add .
git commit -m "Fix: Update link deletion"
git push
```

Vercel and Render will detect the push and redeploy automatically (1-2 minutes).

## Part 7: Performance Optimization

### Frontend (Vercel)

Vercel automatically optimizes your build:
- ✅ Minification
- ✅ Code splitting
- ✅ Image optimization
- ✅ CDN distribution

No additional configuration needed.

### Backend (Render)

To improve performance:
1. Upgrade from free tier to paid tier (removes cold starts)
2. Add caching headers for API responses
3. Consider migrating to a real database if data grows large

## Part 8: Deployment Checklist

Before considering your project "live," verify:

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] `VITE_API_URL` environment variable set on Vercel
- [ ] Frontend can communicate with backend
- [ ] Shortening a URL works end-to-end
- [ ] Redirect handler works (`/:code` redirects to original URL)
- [ ] Dashboard loads all links
- [ ] Link details page shows analytics
- [ ] Delete link functionality works
- [ ] No CORS errors in browser console
- [ ] No errors in Render logs

## Part 9: Going Live on GitHub

Once deployed, update your README:

```markdown
## 🚀 Live Demo

[**Try it live →**](https://smart-link-shortener.vercel.app)

**Frontend:** https://smart-link-shortener.vercel.app  
**Backend API:** https://smart-link-shortener-api.onrender.com
```

Then commit and push:

```bash
git add README.md
git commit -m "docs: Add live demo links"
git push
```

## Part 10: Scaling Beyond Free Tier

If your project gets popular, upgrade to:

| Service | Free Tier | Paid Tier | Cost |
|---------|-----------|-----------|------|
| Vercel | 100GB bandwidth/month | Unlimited | Pay as you go |
| Render | 750 hours/month | Always-on | $7/month |
| Database | JSON file | PostgreSQL | $15/month |

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Render
3. ✅ Wire them together
4. ✅ Test end-to-end
5. ⏭️ Add custom domain (optional)
6. ⏭️ Monitor performance
7. ⏭️ Collect feedback and iterate

---

**Your Smart Link Shortener is now live on the internet!** 🚀

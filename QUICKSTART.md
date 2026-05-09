# Quick Start Guide

Get the Smart Link Shortener running on your machine in 5 minutes.

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **pnpm 10+** — [Install](https://pnpm.io/installation)

## Installation & Running

### 1. Extract the Project

```bash
unzip smart-link-shortener.zip
cd smart-link-shortener
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs all required packages (React, Express, Tailwind, etc.).

### 3. Start Development Server

```bash
pnpm dev
```

You'll see output like:

```
➜  Local:   http://localhost:3000/
➜  Network: http://169.254.0.21:3000/
```

### 4. Open in Browser

Visit **[http://localhost:3000](http://localhost:3000)**

You should see the Smart Link Shortener home page with:
- URL input field
- "Shorten" button
- Recent links section
- Stats sidebar

## Try It Out

1. **Paste a URL** — Try: `https://www.example.com/very/long/url/that/needs/shortening`
2. **Click "Shorten"** — You'll get a short code like `abc123`
3. **Copy the link** — Click the copy button
4. **View Dashboard** — Click "Dashboard" to see all your links
5. **Check Analytics** — Click "Details" on any link to see click history

## File Structure

```
smart-link-shortener/
├── client/              # React frontend
├── server/              # Express backend
├── data/                # Database (auto-created)
├── package.json         # Dependencies
└── README.md            # Full documentation
```

## Available Commands

```bash
pnpm dev        # Start development server (with hot reload)
pnpm build      # Build for production
pnpm start      # Run production server
pnpm check      # Check TypeScript types
pnpm format     # Format code
```

## Troubleshooting

### Port 3000 Already in Use

If you get "Port 3000 already in use," either:

1. **Kill the process using port 3000:**
   ```bash
   # On macOS/Linux
   lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Or use a different port:**
   ```bash
   PORT=3001 pnpm dev
   ```

### Dependencies Not Installing

If `pnpm install` fails:

```bash
# Clear cache
pnpm store prune

# Try again
pnpm install
```

### TypeScript Errors

If you see TypeScript errors:

```bash
# Check types
pnpm check

# This should show "No errors"
```

### App Won't Start

Check the console output for errors. Common issues:

1. **Node version too old** — Requires Node 18+
2. **Port in use** — See above
3. **Missing dependencies** — Run `pnpm install` again

## Next Steps

1. ✅ Get it running locally
2. ⏭️ Explore the code (see [DOCUMENTATION.md](./DOCUMENTATION.md))
3. ⏭️ Push to GitHub (see [GITHUB_SETUP.md](./GITHUB_SETUP.md))
4. ⏭️ Deploy to production (see [DEPLOYMENT.md](./DEPLOYMENT.md))

## Project Overview

**Smart Link Shortener** is a full-stack application with:

- **Frontend** — React 19 with Tailwind CSS
- **Backend** — Express.js with JSON database
- **Features** — URL shortening, click tracking, analytics dashboard
- **Design** — Minimal Brutalism with warm accents

See [README.md](./README.md) for full details.

---

**Questions?** Check [DOCUMENTATION.md](./DOCUMENTATION.md) for comprehensive guides.

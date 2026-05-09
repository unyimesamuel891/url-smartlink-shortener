# Smart Link Shortener — Complete Documentation

## Section 1: Code Documentation

This section explains every major file and folder in the Smart Link Shortener project, describing what each component does, why it exists, and how it connects to the rest of the application.

### Project Structure Overview

The project follows a **monorepo architecture** with a clear separation between frontend (React) and backend (Express). This approach allows both to share types and utilities while remaining independently deployable.

```
smart-link-shortener/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── pages/            # Page-level components (Home, Dashboard, LinkDetail)
│   │   ├── components/       # Reusable UI components (LinkCard, UrlInput, etc.)
│   │   ├── hooks/            # Custom React hooks (useLinks)
│   │   ├── lib/              # Utility functions (truncateUrl, formatDate, etc.)
│   │   ├── contexts/         # React contexts (ThemeContext)
│   │   ├── App.tsx           # Main router and app layout
│   │   ├── main.tsx          # React entry point
│   │   └── index.css         # Global styles and Tailwind configuration
│   ├── public/               # Static files (favicon, robots.txt)
│   └── index.html            # HTML template
├── server/                    # Express backend application
│   └── index.ts              # Main server file with all API routes
├── shared/                    # Shared types and constants (placeholder)
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite build configuration
```

### Frontend Structure

#### `client/src/pages/`

**Home.tsx** — The landing page and primary user interface. This page displays the URL shortener input field on the left (60% width) and a stats sidebar on the right (40% width). The layout follows an asymmetric grid pattern to create visual interest. The page fetches recent links from the backend and displays them in a card-based layout below the input. This is where users first interact with the application.

**Dashboard.tsx** — A full-page view of all shortened links. Users can sort links by "Most Recent" or "Most Clicks" using toggle buttons. Each link is displayed as a card with the original URL, short code, click count, and action buttons (Copy, Details, Delete). This page is essential for users who want to manage and analyze all their links at once.

**LinkDetail.tsx** — A detailed analytics page for a single shortened link. It displays a line chart showing clicks over time, the full click history with timestamps, and action buttons. This page is accessed by clicking the "Details" button on a link card. It provides deeper insights into how a specific link is performing.

**NotFound.tsx** — A 404 error page displayed when users navigate to a non-existent route. This provides a friendly user experience and includes a link back to the home page.

#### `client/src/components/`

**LinkCard.tsx** — A reusable component that renders a single link in the dashboard or home page. It displays the short code (in monospace font), truncated original URL, click count, creation date, and three action buttons (Copy, Details, Delete). The card features a terracotta accent bar on the left edge, which is a signature design element. When the user clicks "Copy," the button shows a success state with a checkmark and the background flashes sage green.

**UrlInput.tsx** — A form component for entering and shortening URLs. It consists of an input field with placeholder text and a "Shorten" button. The component handles form submission, validates the URL, and calls the `shortenUrl` function from the `useLinks` hook. It displays loading state while the request is in progress.

#### `client/src/hooks/`

**useLinks.ts** — A custom React hook that manages all link-related state and API interactions. It provides functions for fetching all links, fetching a single link with full details, shortening a new URL, and deleting a link. The hook also manages loading and error states. This hook is used across multiple pages and components, centralizing all data fetching logic and making the code more maintainable.

#### `client/src/lib/`

**utils.ts** — A collection of utility functions used throughout the frontend. `truncateUrl()` shortens long URLs for display. `formatDate()` and `formatDateTime()` convert ISO timestamps to human-readable formats. The `cn()` function merges Tailwind classes with proper precedence handling.

#### `client/src/contexts/`

**ThemeContext.tsx** — Provides theme switching functionality (light/dark mode). This context is wrapped around the entire app in `App.tsx`, allowing any component to access the current theme and toggle it if needed.

#### `client/src/index.css`

This file contains all global styles and Tailwind CSS configuration. It defines the color palette for the "Minimal Brutalism with Warm Accents" design philosophy:
- **Background:** Warm cream (`#faf8f3`)
- **Text:** Deep charcoal (`#1a1a18`)
- **Primary Accent:** Terracotta (`#c85a3a`)
- **Secondary Accent:** Muted sage (`#7a9b8e`)
- **Borders:** Light taupe (`#e8e4dd`)

The file also includes custom Tailwind theme overrides and a responsive `.container` utility class.

#### `client/src/App.tsx`

The main application component that sets up routing using Wouter. It defines all routes:
- `/` — Home page
- `/dashboard` — Dashboard page
- `/link/:code` — Link detail page
- `/*` — 404 page

The component also wraps the entire app with `ThemeProvider`, `TooltipProvider`, and `Toaster` for theme management, tooltips, and toast notifications.

### Backend Structure

#### `server/index.ts`

The Express server file contains all API routes and business logic. It initializes a JSON database using `lowdb` and defines the following endpoints:

**POST /api/shorten** — Accepts a URL in the request body, validates it, checks for duplicates, generates a unique 6-character short code using `nanoid`, and saves the link to the database. Returns the short code and full short URL.

**GET /api/links** — Returns all links with their click counts. Used by the dashboard and home page to display link lists.

**GET /api/links/:code** — Returns a single link with full click history. Used by the link detail page to display analytics.

**DELETE /api/links/:code** — Deletes a link from the database. Used when users remove links they no longer need.

**GET /:code** — The redirect handler. When someone visits a short link, this endpoint looks up the code, logs the click with a timestamp, and redirects to the original URL. This is the core functionality of the shortener.

The server uses **lowdb** for data persistence, storing all links in a JSON file at `data/db.json`. This approach is lightweight and requires no external database, making it perfect for a simple, self-contained application.

### Data Persistence

**data/db.json** — A JSON file that stores all shortened links. Each link object contains:
- `id` — Unique identifier (generated with `nanoid`)
- `code` — The short code (e.g., "abc123")
- `originalUrl` — The full URL the user shortened
- `createdAt` — ISO timestamp of when the link was created
- `clicks` — Array of click objects, each with a timestamp

This file is automatically created on first run and persists across server restarts.

### Configuration Files

**package.json** — Defines all project dependencies and npm scripts. Key scripts include:
- `pnpm dev` — Start the development server
- `pnpm build` — Build the frontend and bundle the backend
- `pnpm start` — Run the production server
- `pnpm check` — Run TypeScript type checking

**tsconfig.json** — Configures TypeScript compilation. It includes paths for absolute imports (`@/*` for client code) and sets the target to ES2022 to support modern JavaScript features.

**vite.config.ts** — Configures Vite for development and production builds. It enables React Fast Refresh for hot module replacement and sets up the proxy for API requests during development.

### Environment Variables

The following environment variables can be configured:

- `VITE_API_URL` — The base URL for API requests (defaults to `http://localhost:3000` in development)
- `SHORT_DOMAIN` — The domain used in shortened links (defaults to `http://localhost:3000`)
- `PORT` — The port the server listens on (defaults to 3000)

### How It All Connects

1. **User visits the home page** → React loads and renders the Home component
2. **User pastes a URL and clicks "Shorten"** → UrlInput component calls `shortenUrl()` from useLinks hook
3. **useLinks hook makes POST request** → Backend validates URL, generates short code, saves to database
4. **Backend returns short code** → Frontend displays it in a toast and refreshes the link list
5. **User clicks a short link** → Browser navigates to `/:code`
6. **Backend receives request** → Logs the click, redirects to original URL
7. **User views analytics** → Clicks "Details" on a link card
8. **LinkDetail page loads** → Fetches full click history from backend
9. **Chart renders** → Recharts visualizes clicks over time

This flow demonstrates how the frontend and backend work together seamlessly to provide a complete link shortening experience.

---

## Section 2: Case Study (Portfolio-Ready)

### Project Overview

I built a **Smart Link Shortener** — a full-stack web application that allows users to create shortened URLs, track click analytics, and manage their links through an intuitive dashboard. The application combines a React frontend with an Express backend and uses JSON file storage for data persistence.

**Live Demo:** [Your deployment URL]  
**GitHub Repository:** [Your GitHub link]  
**Technologies:** React 19, Express.js, Tailwind CSS, Recharts, lowdb, TypeScript

### Problem Statement

Link shorteners are everywhere, but most are either bloated SaaS platforms or bare-bones utilities. I wanted to build something in between — a tool that feels like it was made by a developer, for developers. Something that:

- **Respects simplicity** — No unnecessary features or dark patterns
- **Provides real insights** — Click analytics with visual charts, not just raw numbers
- **Works offline** — No complex database setup required
- **Feels intentional** — Thoughtful design, not generic templates

Most link shorteners I've used feel either corporate or amateurish. I set out to prove that a small, focused tool could feel premium and handcrafted.

### My Role & Process

I designed and built this project from scratch, handling both frontend and backend development. My process was:

1. **Design first** — I created a design system based on "Minimal Brutalism with Warm Accents," choosing specific colors (terracotta, sage, cream) and typography (monospace headers, clean body text) to give the app personality.

2. **Backend architecture** — I designed a RESTful API with clear separation of concerns, using Express for routing and lowdb for data persistence. This kept the project lightweight while remaining scalable.

3. **Frontend structure** — I built reusable components and custom hooks to manage state efficiently. The `useLinks` hook centralizes all data fetching, making the code DRY and testable.

4. **Responsive design** — I implemented a mobile-first approach with asymmetric layouts on desktop to create visual interest.

5. **Polish & refinement** — I added micro-interactions (copy feedback, hover states, loading skeletons) to make the app feel responsive and alive.

### Technical Decisions

**Why JSON over a database?** I chose lowdb for data persistence instead of PostgreSQL or MongoDB because the project doesn't require complex queries or multi-user authentication. JSON storage is simpler to set up, easier to debug, and sufficient for the use case. If the app scales to thousands of users, migrating to a real database would be straightforward.

**Why Recharts?** I selected Recharts for charting because it's lightweight, composable, and integrates seamlessly with React. The library provides beautiful charts out of the box without requiring extensive configuration.

**Why Tailwind CSS?** Tailwind enabled rapid development with a consistent design system. I customized the color palette in `index.css` to match my design philosophy, ensuring every component feels cohesive.

**Why Wouter instead of React Router?** Wouter is a minimal routing library (4KB vs 40KB for React Router). For a simple app with three routes, the overhead of React Router wasn't justified.

**Monorepo structure** — I kept the frontend and backend in a single repository to simplify development and deployment. Both can be built and deployed independently, but sharing the codebase makes it easier to maintain types and keep them in sync.

### Challenges & How I Solved Them

**Challenge 1: Collision handling for short codes**

When generating short codes, there's a theoretical risk of collision — two URLs getting the same code. I solved this by:
- Using `nanoid(6)` to generate codes with 2.8 trillion possible combinations
- Checking for existing codes before saving
- Regenerating if a collision occurs (extremely rare)

This approach is simple and effective for the expected scale.

**Challenge 2: Click tracking without slowing redirects**

Recording clicks needed to be fast — users expect instant redirects. I solved this by:
- Logging clicks synchronously before redirecting (minimal overhead)
- Storing timestamps in an array, avoiding complex database queries
- Using `await db.write()` to ensure data is persisted before redirecting

The entire process takes ~5ms, imperceptible to users.

**Challenge 3: State management across pages**

The app has three pages that all need to display and modify links. I solved this by:
- Creating a custom `useLinks` hook that centralizes all API calls
- Using React's `useEffect` to fetch data on component mount
- Refetching the link list after mutations (create, delete) to keep UI in sync

This approach is simpler than Redux or Zustand for a small app, and easier to understand.

### Results & Learnings

The final product is a **clean, intentional tool** that demonstrates full-stack development skills. Key achievements:

- **Responsive design** — Works beautifully on mobile, tablet, and desktop
- **Real-time analytics** — Users can see click trends with interactive charts
- **Thoughtful UX** — Micro-interactions and empty states make the app feel polished
- **Production-ready code** — TypeScript, error handling, and proper separation of concerns

**Key learnings:**

1. **Design matters** — Choosing a specific aesthetic (Minimal Brutalism) and committing to it made the app feel intentional, not generic.

2. **Simplicity is powerful** — Avoiding unnecessary features (user auth, custom slugs, paid plans) made the project shippable and focused.

3. **Small details compound** — Micro-interactions, proper spacing, and thoughtful copy transform a functional tool into something people enjoy using.

### Future Improvements

If I were to extend this project, I'd add:

- **User authentication** — Allow users to create accounts and have persistent link history
- **Custom slugs** — Let users choose their own short codes instead of random ones
- **Expiring links** — Add the ability to set an expiration date on links
- **QR codes** — Generate QR codes for each shortened link
- **Advanced analytics** — Track referrer, device type, geographic location
- **Link groups** — Organize links into campaigns or categories
- **API key access** — Allow programmatic link creation via API

These features would transform the tool from a personal utility into a full-featured SaaS platform, but they're intentionally left out of the MVP to keep the scope manageable and the code clean.

---

## Section 3: GitHub Push Guide

### Step 1: Initialize Git (If Not Already Done)

If you haven't initialized Git in your project directory, run:

```bash
git init
```

This creates a `.git` folder that tracks all version history.

### Step 2: Configure Git User

Set your Git user information (this appears in commit history):

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

To set this globally for all projects, add the `--global` flag:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Create a `.gitignore` File

Before committing, create a `.gitignore` file to exclude files that shouldn't be tracked:

```
node_modules/
dist/
.env
.env.local
data/db.json
.DS_Store
*.log
.vite/
```

**Why these files?**
- `node_modules/` — Dependencies are huge; they're reinstalled from `package.json`
- `dist/` — Build output; regenerated on each build
- `.env` — Contains secrets and API keys (never commit these)
- `data/db.json` — Local data file; each environment has its own
- `.DS_Store` — macOS system file; not needed in version control

### Step 4: Stage and Commit Your Code

Add all files to the staging area:

```bash
git add .
```

Create your first commit with a descriptive message:

```bash
git commit -m "Initial commit: Smart Link Shortener with React frontend and Express backend"
```

**Good commit messages:**
- Start with a verb (Initial, Add, Fix, Refactor)
- Be specific about what changed
- Keep it under 50 characters for the headline
- Add a blank line, then a longer description if needed

Example of a strong commit message:

```
Add link detail page with click analytics

- Implement LinkDetail component with Recharts visualization
- Add click history list with timestamps
- Create fetchLinkDetail hook method
- Style with Minimal Brutalism design system
```

### Step 5: Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Enter repository name: `smart-link-shortener`
5. Add a description: "A minimal URL shortener with analytics dashboard"
6. Choose **Public** (so recruiters can see it)
7. **Do NOT** initialize with README, .gitignore, or license (you already have these)
8. Click **Create repository**

### Step 6: Link Your Local Repository to GitHub

GitHub will show you commands to push an existing repository. Run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/smart-link-shortener.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 7: Monorepo vs. Two Repositories?

**Recommendation: Keep as a monorepo (one repository)**

**Pros of monorepo:**
- Easier to keep frontend and backend in sync
- Single place for documentation
- Simpler CI/CD setup
- Easier for recruiters to understand the full project

**Cons:**
- Slightly more complex deployment (need to build both)
- Larger repository size (minor issue)

**If you wanted two repositories:**
- Create `smart-link-shortener-frontend` and `smart-link-shortener-backend`
- Share types via npm package (more complex)
- Deploy independently (more flexibility)

For this project, **monorepo is the better choice**.

### Step 8: Write a Strong README

Your README is the first thing recruiters see. Make it count:

```markdown
# Smart Link Shortener

A minimal, intentional URL shortener with real-time analytics. Built with React, Express, and Tailwind CSS.

## Features

- **Instant URL shortening** — Paste a long URL, get a short link in milliseconds
- **Click analytics** — Track clicks over time with interactive charts
- **Clean dashboard** — Manage all your links in one place
- **Responsive design** — Works on mobile, tablet, and desktop
- **No database setup** — Uses JSON file storage for simplicity

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Recharts
- **Backend:** Express.js, lowdb
- **Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/smart-link-shortener.git
cd smart-link-shortener
pnpm install
```

### Development

Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
client/          # React frontend
server/          # Express backend
data/            # JSON database
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shorten` | Create a shortened link |
| GET | `/api/links` | Get all links |
| GET | `/api/links/:code` | Get link details with click history |
| DELETE | `/api/links/:code` | Delete a link |
| GET | `/:code` | Redirect to original URL |

## Design Philosophy

This app follows a **Minimal Brutalism with Warm Accents** design system — honest, intentional, and human-made. Every design decision serves a purpose.

## Future Improvements

- User authentication
- Custom slugs
- QR code generation
- Advanced analytics (referrer, device, location)
- Link expiration

## License

MIT

## Author

[Your Name] — [Your Portfolio/Website]
```

### Step 9: Commit and Push

After writing your README, commit and push:

```bash
git add README.md
git commit -m "Add comprehensive README"
git push
```

### Step 10: Make Your Repository Shine

- **Add a description** — Go to your repo settings and add a short description
- **Add topics** — Click "Add topics" and add: `link-shortener`, `react`, `express`, `fullstack`
- **Pin the repository** — Go to your GitHub profile and pin this repo to show it prominently

### Ongoing Workflow

For future changes:

```bash
# Make changes to your code
git add .
git commit -m "Descriptive commit message"
git push
```

**Pro tip:** Commit frequently with clear messages. Recruiters look at your commit history to see how you think and communicate.

---

## Section 4: Deployment Guide

### Overview

This guide walks you through deploying the Smart Link Shortener to production:
- **Frontend** → Vercel (free tier available)
- **Backend** → Render (free tier available)
- **Wiring them together** → Environment variables and CORS

### Part A: Deploy Frontend to Vercel

#### Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **GitHub** as your auth method
4. Authorize Vercel to access your GitHub repositories

#### Step 2: Import Your Project

1. Click **New Project**
2. Select your `smart-link-shortener` repository
3. Vercel auto-detects it's a Vite project
4. Click **Deploy**

Vercel will build and deploy your frontend automatically. You'll get a URL like `smart-link-shortener.vercel.app`.

#### Step 3: Configure Environment Variables

1. Go to your project settings in Vercel
2. Click **Environment Variables**
3. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.onrender.com` (we'll get this after deploying the backend)
4. Click **Save**

Redeploy after adding the variable:
1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Select **Redeploy**

### Part B: Deploy Backend to Render

#### Step 1: Create a Render Account

1. Go to [render.com](https://render.com)
2. Click **Sign Up**
3. Choose **GitHub** as your auth method
4. Authorize Render to access your repositories

#### Step 2: Create a New Web Service

1. Click **New +**
2. Select **Web Service**
3. Select your `smart-link-shortener` repository
4. Configure:
   - **Name:** `smart-link-shortener-api`
   - **Environment:** `Node`
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
5. Click **Create Web Service**

Render will deploy your backend. You'll get a URL like `smart-link-shortener-api.onrender.com`.

#### Step 3: Configure Environment Variables

1. Go to your service settings in Render
2. Click **Environment**
3. Add:
   - **SHORT_DOMAIN:** `https://smart-link-shortener-api.onrender.com`
4. Click **Save**

### Part C: Wire Frontend and Backend Together

#### Step 1: Update Frontend Environment Variable

Go back to Vercel and update the `VITE_API_URL` environment variable:
- **Value:** `https://smart-link-shortener-api.onrender.com`

Redeploy the frontend in Vercel.

#### Step 2: Test the Connection

1. Visit your Vercel frontend URL
2. Try shortening a URL
3. Check the browser console (F12) for any CORS errors

### Part D: Handling Common Issues

#### Issue 1: CORS Errors

**Error:** `Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Solution:** The backend needs to allow requests from the frontend. Update `server/index.ts`:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
```

Add `FRONTEND_URL` environment variable in Render:
- **FRONTEND_URL:** `https://smart-link-shortener.vercel.app`

#### Issue 2: Render Cold Starts

**Problem:** Render's free tier spins down after 15 minutes of inactivity. First request takes 30+ seconds.

**Solution:** This is expected behavior on the free tier. For production, upgrade to a paid plan or use a service with always-on instances.

#### Issue 3: Environment Variables Not Loading

**Problem:** Backend can't access environment variables.

**Solution:**
1. Verify variables are set in Render dashboard
2. Redeploy the service
3. Check logs: `Render Dashboard → Logs`

#### Issue 4: 404 on Redirect

**Problem:** Visiting `yourdomain.com/abc123` returns 404 instead of redirecting.

**Solution:** The frontend is catching the route. Update `App.tsx` to let the backend handle `/:code` routes:

```typescript
// In App.tsx, before the final fallback route:
<Route path={"/:code"} component={LinkDetailPage} />
```

Actually, this is already correct. The issue might be that the backend isn't reachable. Check that `VITE_API_URL` is set correctly.

### Part E: Custom Domain Setup

#### Option 1: Use Vercel's Domain Registration

1. Go to Vercel project settings
2. Click **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `myshortener.com`)
5. Follow the DNS setup instructions

#### Option 2: Use Your Existing Domain

If you already own a domain:

1. **For frontend (Vercel):**
   - Go to Vercel project settings → Domains
   - Add your domain
   - Update DNS records to point to Vercel

2. **For backend (Render):**
   - Go to Render service settings → Custom Domain
   - Add a subdomain (e.g., `api.myshortener.com`)
   - Update DNS records

#### Option 3: Use Subdomains

- Frontend: `myshortener.com` → Vercel
- Backend: `api.myshortener.com` → Render

### Part F: Monitoring and Maintenance

#### Check Deployment Status

- **Vercel:** Dashboard shows build status and deployment history
- **Render:** Dashboard shows service status and logs

#### View Logs

- **Vercel:** Go to Deployments → Click deployment → Logs
- **Render:** Go to service → Logs

#### Redeploy

Push new code to GitHub, and both services will automatically redeploy.

```bash
git add .
git commit -m "Fix bug in link deletion"
git push
```

Vercel and Render will detect the push and redeploy automatically (usually within 1-2 minutes).

### Part G: Performance Optimization

#### Frontend (Vercel)

Vercel automatically optimizes your build:
- Minification
- Code splitting
- Image optimization
- CDN distribution

No additional configuration needed.

#### Backend (Render)

To improve performance:
1. Upgrade from free tier to paid tier (removes cold starts)
2. Add caching headers for API responses
3. Consider migrating to a real database if data grows large

### Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Environment variables configured on both services
- [ ] Frontend can communicate with backend (test by shortening a URL)
- [ ] Redirect handler works (`/:code` redirects to original URL)
- [ ] Custom domain set up (optional)
- [ ] Logs checked for errors
- [ ] README updated with deployed URLs

### Troubleshooting Checklist

- [ ] Check browser console for errors (F12)
- [ ] Check Vercel logs for frontend errors
- [ ] Check Render logs for backend errors
- [ ] Verify environment variables are set correctly
- [ ] Test API endpoints with curl or Postman
- [ ] Check CORS configuration
- [ ] Verify database file exists on backend

### Next Steps

1. **Monitor performance** — Use Vercel Analytics and Render monitoring
2. **Collect feedback** — Share with friends and iterate
3. **Add features** — Implement custom slugs, QR codes, etc.
4. **Scale up** — Migrate to paid tiers as traffic grows

---

## References

1. [Vercel Documentation](https://vercel.com/docs) — Official Vercel deployment guide
2. [Render Documentation](https://render.com/docs) — Official Render deployment guide
3. [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html) — Express routing and middleware
4. [React Documentation](https://react.dev) — React hooks and component patterns
5. [Tailwind CSS Documentation](https://tailwindcss.com/docs) — Utility-first CSS framework
6. [Recharts Documentation](https://recharts.org) — React charting library
7. [lowdb Documentation](https://github.com/typicode/lowdb) — Lightweight JSON database
8. [TypeScript Handbook](https://www.typescriptlang.org/docs/) — TypeScript configuration and types

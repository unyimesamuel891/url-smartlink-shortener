# link. — Smart Link Shortener

A minimal, intentional URL shortener with real-time analytics. Built with React, Express, and Tailwind CSS. Designed for developers who value simplicity and craftsmanship.

![link. Home Page](https://img.shields.io/badge/React-19-blue?logo=react) ![Express](https://img.shields.io/badge/Express-4-green?logo=express) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)

## ✨ Features

- **Instant URL Shortening** — Paste a long URL, get a short link in milliseconds
- **Click Analytics** — Track clicks over time with interactive Recharts visualizations
- **Clean Dashboard** — Manage all your links in one beautiful interface
- **Link Details** — Deep dive into individual link performance with full click history
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop
- **No Database Setup** — Uses JSON file storage for simplicity and portability
- **Copy Feedback** — Instant visual feedback when copying short links
- **Minimal Brutalism Design** — Honest, intentional UI with warm accents and monospace typography

## 🎨 Design Philosophy

**Minimal Brutalism with Warm Accents** — This app rejects generic SaaS templates in favor of a handcrafted aesthetic. Every design decision serves a purpose:

- **Color Palette:** Warm cream backgrounds, deep charcoal text, terracotta accents, and sage green highlights
- **Typography:** Monospace headers (Courier Prime) for technical credibility, clean body text (Inter)
- **Interactions:** Subtle hover states, fade-in animations, and tactile feedback
- **Layout:** Asymmetric grids and intentional whitespace create visual interest

The result is a tool that feels **made by developers, for developers** — not a corporate platform or amateur project.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- pnpm 10+ ([install](https://pnpm.io/installation))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/smart-link-shortener.git
cd smart-link-shortener

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically reload when you make changes.

### Production Build

```bash
# Build frontend and backend
pnpm build

# Start the production server
pnpm start
```

The app will be available at `http://localhost:3000`.

## 📁 Project Structure

```
smart-link-shortener/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page with URL shortener
│   │   │   ├── Dashboard.tsx       # View all links
│   │   │   ├── LinkDetail.tsx      # Analytics for single link
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/
│   │   │   ├── LinkCard.tsx        # Link display component
│   │   │   └── UrlInput.tsx        # URL input form
│   │   ├── hooks/
│   │   │   └── useLinks.ts         # API calls and state management
│   │   ├── lib/
│   │   │   └── utils.ts            # Utility functions
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx    # Theme provider
│   │   ├── App.tsx                 # Router and layout
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── public/                      # Static files
│   └── index.html                  # HTML template
├── server/
│   └── index.ts                    # Express API server
├── data/
│   └── db.json                     # JSON database (auto-created)
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite build config
└── DOCUMENTATION.md                # Full documentation
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api` except for the redirect handler.

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| POST | `/api/shorten` | Create a shortened link | `{ url: string }` | `{ code: string, shortUrl: string }` |
| GET | `/api/links` | Get all links | — | `{ links: Link[] }` |
| GET | `/api/links/:code` | Get link details | — | `{ link: LinkDetail }` |
| DELETE | `/api/links/:code` | Delete a link | — | `{ success: boolean }` |
| GET | `/:code` | Redirect to original URL | — | Redirect (HTTP 301) |

### Example Requests

**Create a shortened link:**
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/very/long/url"}'

# Response:
# {"code":"abc123","shortUrl":"http://localhost:3000/abc123"}
```

**Get all links:**
```bash
curl http://localhost:3000/api/links

# Response:
# {
#   "links": [
#     {
#       "id":"1",
#       "code":"abc123",
#       "originalUrl":"https://example.com/very/long/url",
#       "clickCount":5,
#       "createdAt":"2026-05-08T21:00:00.000Z"
#     }
#   ]
# }
```

**Get link details with click history:**
```bash
curl http://localhost:3000/api/links/abc123

# Response:
# {
#   "link": {
#     "id":"1",
#     "code":"abc123",
#     "originalUrl":"https://example.com/very/long/url",
#     "clickCount":5,
#     "createdAt":"2026-05-08T21:00:00.000Z",
#     "clicks": [
#       {"timestamp":"2026-05-08T21:05:00.000Z"},
#       {"timestamp":"2026-05-08T21:10:00.000Z"}
#     ]
#   }
# }
```

## 🛠 Tech Stack

### Frontend
- **React 19** — UI library with hooks
- **Tailwind CSS 4** — Utility-first CSS framework
- **Recharts** — React charting library
- **Wouter** — Lightweight client-side router
- **TypeScript** — Type safety
- **shadcn/ui** — Pre-built accessible components

### Backend
- **Express.js** — Web framework
- **lowdb** — Lightweight JSON database
- **nanoid** — Unique ID generation
- **TypeScript** — Type safety

### Build & Development
- **Vite** — Lightning-fast build tool
- **pnpm** — Fast package manager
- **esbuild** — JavaScript bundler

## 📊 Data Model

### Link Object
```typescript
interface Link {
  id: string;              // Unique identifier
  code: string;            // Short code (e.g., "abc123")
  originalUrl: string;     // Full URL
  clickCount: number;      // Total clicks
  createdAt: string;       // ISO timestamp
}

interface LinkDetail extends Link {
  clicks: Click[];         // Array of click records
}

interface Click {
  timestamp: string;       // ISO timestamp of click
}
```

## 🎯 Key Features Explained

### URL Shortening
When you paste a URL and click "Shorten," the app:
1. Validates the URL format
2. Checks if it's already shortened (deduplication)
3. Generates a unique 6-character code using `nanoid`
4. Saves to the JSON database
5. Returns the short URL

### Click Tracking
Every time someone visits a short link:
1. The server logs the click with a timestamp
2. Updates the click count
3. Redirects to the original URL (HTTP 301)

The entire process takes ~5ms, imperceptible to users.

### Analytics Dashboard
The dashboard displays:
- **All links** with click counts and creation dates
- **Sorting options** — Most Recent or Most Clicks
- **Quick actions** — Copy link, view details, delete link

### Link Details Page
For each link, you can see:
- **Click trend chart** — Line graph showing clicks over time
- **Full click history** — Timestamped list of every click
- **Link metadata** — Original URL, creation date, total clicks
- **Quick actions** — Copy link or delete it

## 🚢 Deployment

### Deploy to Vercel (Frontend)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New** → **Project**
4. Select your `smart-link-shortener` repository
5. Vercel auto-detects Vite configuration
6. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
7. Click **Deploy**

Your frontend will be live at `https://smart-link-shortener.vercel.app`

### Deploy to Render (Backend)

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New** → **Web Service**
3. Select your `smart-link-shortener` repository
4. Configure:
   - **Name:** `smart-link-shortener-api`
   - **Environment:** Node
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
5. Click **Create Web Service**

Your backend will be live at `https://smart-link-shortener-api.onrender.com`

### Wire Frontend & Backend

1. Go back to Vercel project settings
2. Update `VITE_API_URL` to your Render backend URL
3. Redeploy the frontend

**See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed deployment guide.**

## 🐛 Troubleshooting

### "Cannot GET /:code"
Make sure the backend is running and `VITE_API_URL` is set correctly in the frontend.

### "CORS error"
The backend needs to allow requests from your frontend domain. Update `server/index.ts` to add your frontend URL to the CORS allowlist.

### "No links showing up"
Check that `data/db.json` exists and is readable. The file is auto-created on first run.

### "WebSocket connection failed"
This is a development-only issue. The production build doesn't use WebSocket. If it persists, try `pnpm dev` again.

## 📝 Scripts

```bash
pnpm dev        # Start development server with hot reload
pnpm build      # Build frontend and backend for production
pnpm start      # Run production server
pnpm check      # Run TypeScript type checking
pnpm format     # Format code with Prettier
```

## 🎓 Learning Resources

This project demonstrates:
- **Full-stack development** with React and Express
- **State management** with custom hooks
- **API design** with RESTful principles
- **Database design** with JSON persistence
- **Responsive design** with Tailwind CSS
- **Component composition** with React
- **TypeScript** for type safety
- **Deployment** to production services

Perfect for learning or as a portfolio project.

## 🔮 Future Improvements

- **User authentication** — Create accounts and save links
- **Custom slugs** — Let users choose short codes
- **Link expiration** — Set expiration dates on links
- **QR codes** — Generate QR codes for each link
- **Advanced analytics** — Track referrer, device, location
- **Link groups** — Organize links into campaigns
- **API key access** — Programmatic link creation
- **Dark mode** — Theme switcher for dark theme

## 📄 License

MIT License — feel free to use this project for personal or commercial purposes.

## 👤 Author

Built with ❤️ by [Your Name]

- Portfolio: [your-website.com]
- GitHub: [@your-username](https://github.com/your-username)
- Twitter: [@your-handle](https://twitter.com/your-handle)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have questions or run into issues:
1. Check the [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed guides
2. Search existing [GitHub Issues](https://github.com/your-username/smart-link-shortener/issues)
3. Create a new issue with a clear description

---

**Made with Vite ⚡ React ⚛️ Express 🚀**

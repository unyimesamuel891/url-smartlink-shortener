import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, Collection } from "mongodb";
import { nanoid } from "nanoid";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type definitions
interface Click {
  timestamp: string;
}

interface Link {
  id: string;
  code: string;
  originalUrl: string;
  createdAt: string;
  clicks: Click[];
}

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI || "";
let linksCollection: Collection<Link>;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("smartlink");
  linksCollection = db.collection<Link>("links");
  console.log("Connected to MongoDB");
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Helper function: Generate short code
  function generateShortCode(): string {
    return nanoid(6);
  }

  // Helper function: Validate URL
  function isValidUrl(urlString: string): boolean {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  }

  // API Routes

  /**
   * POST /api/shorten
   * Accepts a long URL, generates a short code, saves it, returns the short link
   */
  app.post("/api/shorten", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;

      if (!url || typeof url !== "string") {
        res.status(400).json({ error: "URL is required" });
        return;
      }

      if (!isValidUrl(url)) {
        res.status(400).json({ error: "Invalid URL format" });
        return;
      }

      // Check for duplicates
      const existingLink = await linksCollection.findOne({ originalUrl: url });
      if (existingLink) {
        res.status(200).json({
          code: existingLink.code,
          shortUrl: `${process.env.SHORT_DOMAIN || "http://localhost:3000"}/${existingLink.code}`,
          message: "This URL was already shortened",
        });
        return;
      }

      // Generate unique short code
      let code = generateShortCode();
      while (await linksCollection.findOne({ code })) {
        code = generateShortCode();
      }

      // Create new link
      const newLink: Link = {
        id: nanoid(),
        code,
        originalUrl: url,
        createdAt: new Date().toISOString(),
        clicks: [],
      };

      await linksCollection.insertOne(newLink);

      res.status(201).json({
        code,
        shortUrl: `${process.env.SHORT_DOMAIN || "http://localhost:3000"}/${code}`,
        originalUrl: url,
      });
    } catch (error) {
      console.error("Error in POST /api/shorten:", error);
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  });

  /**
   * GET /api/links
   * Returns all links with click counts
   */
  app.get("/api/links", async (req: Request, res: Response) => {
    try {
      const links = await linksCollection.find().toArray();
      res.json(
        links.map((link) => ({
          id: link.id,
          code: link.code,
          originalUrl: link.originalUrl,
          createdAt: link.createdAt,
          clickCount: link.clicks.length,
        }))
      );
    } catch (error) {
      console.error("Error in GET /api/links:", error);
      res.status(500).json({ error: "Failed to fetch links" });
    }
  });

  /**
   * GET /api/links/:code
   * Returns a single link with full click history
   */
  app.get("/api/links/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const link = await linksCollection.findOne({ code });

      if (!link) {
        res.status(404).json({ error: "Link not found" });
        return;
      }

      res.json({
        id: link.id,
        code: link.code,
        originalUrl: link.originalUrl,
        createdAt: link.createdAt,
        clickCount: link.clicks.length,
        clicks: link.clicks,
      });
    } catch (error) {
      console.error("Error in GET /api/links/:code:", error);
      res.status(500).json({ error: "Failed to fetch link details" });
    }
  });

  /**
   * DELETE /api/links/:code
   * Deletes a link
   */
  app.delete("/api/links/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const result = await linksCollection.deleteOne({ code });

      if (result.deletedCount === 0) {
        res.status(404).json({ error: "Link not found" });
        return;
      }

      res.json({ message: "Link deleted successfully" });
    } catch (error) {
      console.error("Error in DELETE /api/links/:code:", error);
      res.status(500).json({ error: "Failed to delete link" });
    }
  });

  /**
   * GET /:code
   * Redirects to original URL and logs the click
   */
  app.get("/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;

      // Skip static file routes
      if (code.includes(".")) {
        res.status(404).send("Not found");
        return;
      }

      const link = await linksCollection.findOne({ code });

      if (!link) {
        res.status(404).json({ error: "Short link not found" });
        return;
      }

      // Log the click
      await linksCollection.updateOne(
        { code },
        { $push: { clicks: { timestamp: new Date().toISOString() } } }
      );

      // Redirect to original URL
      res.redirect(link.originalUrl);
    } catch (error) {
      console.error("Error in GET /:code:", error);
      res.status(500).json({ error: "Failed to process redirect" });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

(async () => {
  await connectDB();
  await startServer();
})().catch(console.error);
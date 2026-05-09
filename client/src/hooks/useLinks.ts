import { useState, useEffect, useCallback } from "react";

export interface LinkData {
  id: string;
  code: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

export interface LinkDetail extends LinkData {
  clicks: Array<{ timestamp: string }>;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function useLinks() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all links
  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/links`);
      if (!response.ok) throw new Error("Failed to fetch links");
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single link with full details
  const fetchLinkDetail = useCallback(
    async (code: string): Promise<LinkDetail | null> => {
      try {
        const response = await fetch(`${API_URL}/api/links/${code}`);
        if (!response.ok) throw new Error("Link not found");
        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return null;
      }
    },
    []
  );

  // Shorten a URL
  const shortenUrl = useCallback(
    async (url: string): Promise<{ code: string; shortUrl: string } | null> => {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/shorten`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to shorten URL");
        }

        const data = await response.json();
        // Refresh links after shortening
        await fetchLinks();
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return null;
      }
    },
    [fetchLinks]
  );

  // Delete a link
  const deleteLink = useCallback(
    async (code: string): Promise<boolean> => {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/links/${code}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete link");

        // Refresh links after deletion
        await fetchLinks();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        return false;
      }
    },
    [fetchLinks]
  );

  // Fetch links on mount
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return {
    links,
    loading,
    error,
    fetchLinks,
    fetchLinkDetail,
    shortenUrl,
    deleteLink,
  };
}

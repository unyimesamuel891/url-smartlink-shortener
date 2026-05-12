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
const STORAGE_KEY = "my_link_codes";

// Get this user's saved codes from localStorage
function getSavedCodes(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

// Save a new code to localStorage
function saveCode(code: string) {
  const codes = getSavedCodes();
  if (!codes.includes(code)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...codes, code]));
  }
}

// Remove a code from localStorage
function removeCode(code: string) {
  const codes = getSavedCodes().filter((c) => c !== code);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
}

export function useLinks() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch only THIS user's links using their saved codes
  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const codes = getSavedCodes();
      if (codes.length === 0) {
        setLinks([]);
        return;
      }
      const results = await Promise.all(
        codes.map((code) =>
          fetch(`${API_URL}/api/links/${code}`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      );
      setLinks(results.filter(Boolean));
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

  // Shorten a URL and save the code locally
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
        saveCode(data.code); // Save to localStorage
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
        removeCode(code); // Remove from localStorage
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

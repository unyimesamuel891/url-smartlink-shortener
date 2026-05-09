import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UrlInputProps {
  onShorten: (url: string) => Promise<{ code: string; shortUrl: string } | null>;
  isLoading?: boolean;
}

export default function UrlInput({ onShorten, isLoading = false }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      const result = await onShorten(url);
      if (result) {
        setUrl("");
        toast.success(
          result.code === url
            ? "URL already shortened!"
            : "Link shortened successfully!"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Paste a long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading || isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={loading || isLoading}
          className="bg-[#c85a3a] hover:bg-[#b84a2a] text-white"
        >
          {loading || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Shortening...
            </>
          ) : (
            "Shorten"
          )}
        </Button>
      </div>
    </form>
  );
}

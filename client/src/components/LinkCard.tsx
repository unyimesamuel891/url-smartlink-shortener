import { useState } from "react";
import { Copy, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkData } from "@/hooks/useLinks";
import { truncateUrl, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface LinkCardProps {
  link: LinkData;
  onDelete: (code: string) => void;
  onViewDetails: (code: string) => void;
}

export default function LinkCard({
  link,
  onDelete,
  onViewDetails,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);

  const shortUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${link.code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = () => {
    if (confirm("Delete this link? This action cannot be undone.")) {
      onDelete(link.code);
    }
  };

  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Accent bar */}
      <div className="h-1 bg-[#c85a3a]" />

      <div className="p-6">
        {/* Header with code */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-mono text-sm font-semibold text-[#c85a3a] mb-1">
              {link.code}
            </div>
            <p className="text-sm text-muted-foreground">
              {truncateUrl(link.originalUrl, 45)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {link.clickCount}
            </div>
            <p className="text-xs text-muted-foreground">clicks</p>
          </div>
        </div>

        {/* Date */}
        <p className="text-xs text-muted-foreground mb-4">
          Created {formatDate(link.createdAt)}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1 transition-all duration-200"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(link.code)}
            className="flex-1"
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

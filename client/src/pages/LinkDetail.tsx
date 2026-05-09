import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useLinks, LinkDetail } from "@/hooks/useLinks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Trash2, ChevronLeft } from "lucide-react";
import { formatDateTime, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Link Detail Page — Full Analytics
 * 
 * Design: Minimal Brutalism with Warm Accents
 * - Full-width chart at top showing click trends
 * - Click history list below with timestamps
 * - Copy and delete actions
 * - Back navigation
 */
export default function LinkDetailPage() {
  const [, setLocation] = useLocation();
  const { code } = useParams<{ code: string }>();
  const { fetchLinkDetail, deleteLink } = useLinks();
  const [link, setLink] = useState<LinkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadLink = async () => {
      if (!code) return;
      setLoading(true);
      const data = await fetchLinkDetail(code);
      setLink(data);
      setLoading(false);
    };
    loadLink();
  }, [code, fetchLinkDetail]);

  const handleCopy = async () => {
    if (!link) return;
    const shortUrl = `${window.location.origin}/${link.code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = async () => {
    if (!link) return;
    if (confirm("Delete this link? This action cannot be undone.")) {
      const success = await deleteLink(link.code);
      if (success) {
        setLocation("/dashboard");
      }
    }
  };

  // Prepare chart data: clicks per day
  const chartData = link
    ? (() => {
        const clicksByDay: Record<string, number> = {};
        link.clicks.forEach((click) => {
          const date = new Date(click.timestamp).toLocaleDateString("en-US");
          clicksByDay[date] = (clicksByDay[date] || 0) + 1;
        });

        return Object.entries(clicksByDay)
          .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
          .map(([date, count]) => ({
            date,
            clicks: count,
          }));
      })()
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f3]">
        <header className="border-b border-[#e8e4dd] bg-white">
          <div className="container py-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-6 w-64" />
          </div>
        </header>
        <main className="container py-12">
          <Skeleton className="h-80 rounded-lg mb-8" />
          <Skeleton className="h-96 rounded-lg" />
        </main>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-[#faf8f3]">
        <header className="border-b border-[#e8e4dd] bg-white">
          <div className="container py-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </header>
        <main className="container py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Link not found</p>
          </div>
        </main>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/${link.code}`;

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="border-b border-[#e8e4dd] bg-white">
        <div className="container py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="font-mono text-3xl font-bold text-foreground">
            {link.code}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Created {formatDate(link.createdAt)}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Chart and Info */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white border border-[#e8e4dd] rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Clicks</p>
                <p className="text-4xl font-bold text-[#c85a3a]">
                  {link.clickCount}
                </p>
              </div>
              <div className="bg-white border border-[#e8e4dd] rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Original URL
                </p>
                <p className="text-sm font-mono text-foreground truncate">
                  {link.originalUrl}
                </p>
              </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 ? (
              <div className="bg-white border border-[#e8e4dd] rounded-lg p-6 mb-8">
                <h2 className="font-mono text-lg font-bold text-foreground mb-4">
                  Clicks Over Time
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#e8e4dd" />
                    <XAxis
                      dataKey="date"
                      stroke="#7a9b8e"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#7a9b8e" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#faf8f3",
                        border: "1px solid #e8e4dd",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#c85a3a"
                      dot={{ fill: "#c85a3a", r: 4 }}
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-white border border-[#e8e4dd] rounded-lg p-12 mb-8 text-center">
                <p className="text-muted-foreground">No clicks yet</p>
              </div>
            )}

            {/* Click History */}
            <div className="bg-white border border-[#e8e4dd] rounded-lg p-6">
              <h2 className="font-mono text-lg font-bold text-foreground mb-4">
                Click History
              </h2>
              {link.clicks.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[...link.clicks]
                    .reverse()
                    .map((click, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 rounded hover:bg-[#faf8f3] transition-colors"
                      >
                        <span className="text-sm font-mono text-muted-foreground">
                          #{link.clicks.length - index}
                        </span>
                        <span className="text-sm text-foreground">
                          {formatDateTime(click.timestamp)}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No clicks recorded yet
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e8e4dd] rounded-lg p-6 sticky top-8">
              <h3 className="font-mono text-lg font-bold text-foreground mb-6">
                Actions
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-[#faf8f3] rounded border border-[#e8e4dd]">
                  <p className="text-xs text-muted-foreground mb-2">Short URL</p>
                  <p className="text-sm font-mono text-foreground break-all">
                    {shortUrl}
                  </p>
                </div>

                <Button
                  onClick={handleCopy}
                  className="w-full bg-[#c85a3a] hover:bg-[#b84a2a] text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>

                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { useLinks } from "@/hooks/useLinks";
import LinkCard from "@/components/LinkCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

/**
 * Dashboard Page — Analytics Overview
 * 
 * Design: Minimal Brutalism with Warm Accents
 * - Card-based layout with generous whitespace
 * - Each link card has a left-aligned accent bar (terracotta)
 * - Simple sorting and filtering options
 * - Loading skeletons for data fetch
 */
export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { links, loading, deleteLink } = useLinks();
  const [sortBy, setSortBy] = useState<"recent" | "clicks">("recent");

  const handleDelete = async (code: string) => {
    await deleteLink(code);
  };

  const handleViewDetails = (code: string) => {
    setLocation(`/link/${code}`);
  };

  const sortedLinks = [...links].sort((a, b) => {
    if (sortBy === "recent") {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      return b.clickCount - a.clickCount;
    }
  });

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="border-b border-[#e8e4dd] bg-white">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="font-mono text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All your shortened links and analytics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Filters */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("recent")}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                sortBy === "recent"
                  ? "bg-[#c85a3a] text-white"
                  : "bg-white border border-[#e8e4dd] text-foreground hover:bg-[#faf8f3]"
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setSortBy("clicks")}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                sortBy === "clicks"
                  ? "bg-[#c85a3a] text-white"
                  : "bg-white border border-[#e8e4dd] text-foreground hover:bg-[#faf8f3]"
              }`}
            >
              Most Clicks
            </button>
          </div>
        </div>

        {/* Links Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        ) : sortedLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLinks.map((link) => (
              <LinkCard
                key={link.code}
                link={link}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#e8e4dd] rounded-lg p-16 text-center">
            <p className="text-muted-foreground mb-4">
              No shortened links yet
            </p>
            <button
              onClick={() => setLocation("/")}
              className="text-[#c85a3a] hover:text-[#b84a2a] text-sm font-semibold transition-colors"
            >
              Create your first link →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

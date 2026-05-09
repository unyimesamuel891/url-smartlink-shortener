import { useState } from "react";
import { useLocation } from "wouter";
import { useLinks } from "@/hooks/useLinks";
import UrlInput from "@/components/UrlInput";
import LinkCard from "@/components/LinkCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Home Page — Smart Link Shortener
 * 
 * Design: Minimal Brutalism with Warm Accents
 * - Split layout: input on left (60%), recent links preview on right (40%)
 * - Asymmetric grid for visual interest
 * - Terracotta accent color (#c85a3a) for CTAs and highlights
 * - Monospace font for short codes and technical elements
 */
export default function Home() {
  const [, setLocation] = useLocation();
  const { links, loading, shortenUrl, deleteLink } = useLinks();

  const handleDelete = async (code: string) => {
    await deleteLink(code);
  };

  const handleViewDetails = (code: string) => {
    setLocation(`/link/${code}`);
  };

  const recentLinks = links.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}
      <header className="border-b border-[#e8e4dd] bg-white">
        <div className="container py-6">
          <h1 className="font-mono text-3xl font-bold text-foreground">
            link.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            A minimal URL shortener for developers
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Input */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#e8e4dd] rounded-lg p-8">
              <h2 className="font-mono text-xl font-bold text-foreground mb-2">
                Shorten a URL
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Paste a long URL below and get an instant short link
              </p>
              <UrlInput onShorten={shortenUrl} />
            </div>

            {/* Recent Links Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-mono text-xl font-bold text-foreground">
                    Recent Links
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your {links.length} shortened link{links.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {links.length > 0 && (
                  <button
                    onClick={() => setLocation("/dashboard")}
                    className="text-[#c85a3a] hover:text-[#b84a2a] text-sm font-semibold transition-colors"
                  >
                    View all →
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-lg" />
                  ))}
                </div>
              ) : recentLinks.length > 0 ? (
                <div className="space-y-4">
                  {recentLinks.map((link) => (
                    <LinkCard
                      key={link.code}
                      link={link}
                      onDelete={handleDelete}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#e8e4dd] rounded-lg p-12 text-center">
                  <p className="text-muted-foreground">
                    No links yet. Paste one above ↑
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#e8e4dd] rounded-lg p-8 sticky top-8">
              <h3 className="font-mono text-lg font-bold text-foreground mb-6">
                Stats
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Links</p>
                  <p className="text-4xl font-bold text-[#c85a3a]">
                    {links.length}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Clicks
                  </p>
                  <p className="text-4xl font-bold text-[#7a9b8e]">
                    {links.reduce((sum, link) => sum + link.clickCount, 0)}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#e8e4dd]">
                  <p className="text-xs text-muted-foreground">
                    Data is stored locally in your browser. Links persist across
                    sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import HeroBanner from "./components/HeroBanner";
import ContentRow from "./components/ContentRow";
import TitleModal from "./components/TitleModal";
import TrailerPlayer from "./components/TrailerPlayer";
import VideoPlayer from "./components/VideoPlayer";
import QuickGrid from "./components/QuickGrid";
import PullToRefresh from "./components/PullToRefresh";
import ReelsRow from "./components/ReelsRow";
import ReelsViewer from "./components/ReelsViewer";
import { allContent, rows } from "@/data/content";
import type { ContentItem } from "@/data/content";
import { reelSeries } from "@/data/reels";
import type { ReelSeries } from "@/data/reels";

const heroItems: ContentItem[] = [
  allContent.find((c) => c.id === "from-mgm")!,
  allContent.find((c) => c.id === "severance")!,
  allContent.find((c) => c.id === "the-last-of-us")!,
  allContent.find((c) => c.id === "succession")!,
].filter(Boolean);

const quickItems = rows[0].items.slice(0, 6);

export default function HomePage() {
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [trailer, setTrailer] = useState<{ videoId: string; title: string } | null>(null);
  const [video, setVideo] = useState<{ contentId: string; title: string; season: number; episode: number; tmdbId?: number; tmdbType?: "movie" | "tv" } | null>(null);
  const [selectedReel, setSelectedReel] = useState<{ series: ReelSeries; episode: number } | null>(null);
  const router = useRouter();

  const handlePlay = (item: ContentItem, trailerKey?: string) => {
    const vid = trailerKey ?? item.trailerYouTubeId;
    if (vid) {
      setTrailer({ videoId: vid, title: item.title });
    }
  };

  const handleWatch = (item: ContentItem, season = 1, episode = 1) => {
    setSelected(null);
    setVideo({ contentId: item.id, title: item.title, season, episode, tmdbId: item.tmdbId, tmdbType: item.tmdbType });
  };

  const handleRefresh = useCallback(async () => {
    router.refresh();
    await new Promise<void>(r => setTimeout(r, 900));
  }, [router]);

  // Listen for search result selection from SearchOverlay
  useEffect(() => {
    const handler = (e: Event) => {
      const item = (e as CustomEvent<ContentItem>).detail;
      if (item) setSelected(item);
    };
    window.addEventListener("cinera:select", handler);
    return () => window.removeEventListener("cinera:select", handler);
  }, []);

  return (
    <main className="min-h-screen bg-base">
      <HeroBanner items={heroItems} onMoreInfo={setSelected} onPlay={handlePlay} modalOpen={!!(selected || trailer || video)} />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="relative z-10">
          {/* Spotify-style quick-access grid — mobile only */}
          <QuickGrid items={quickItems} onSelect={setSelected} />

          <section className="sm:-mt-24 space-y-6 pb-20 mt-4 sm:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ReelsRow
                series={reelSeries}
                onSelect={(s, ep) => setSelectedReel({ series: s, episode: ep ?? 1 })}
              />
            </motion.div>
          {rows.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ContentRow
                label={row.label}
                items={row.items}
                onSelect={setSelected}
                onPlay={handlePlay}
              />
            </motion.div>
          ))}
          </section>
        </div>

        <footer className="border-t border-border-subtle py-10 px-6 sm:px-10 lg:px-16">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-text-muted text-sm">© 2025 CINERA.</span>
              <span className="text-text-muted text-xs opacity-60">A content discovery platform. We do not host or stream full titles.</span>
            </div>
            <div className="flex items-center gap-6 text-text-muted text-xs">
              {["Terms", "Privacy", "Accessibility", "Help Center"].map((l) => (
                <span key={l} className="hover:text-white/60 cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
        </footer>
      </PullToRefresh>

      <ReelsViewer
        series={selectedReel?.series ?? null}
        initialEpisode={selectedReel?.episode}
        onClose={() => setSelectedReel(null)}
      />
      <TitleModal
        item={selected}
        onClose={() => setSelected(null)}
        onPlay={handlePlay}
        onWatch={handleWatch}
      />
      <TrailerPlayer
        videoId={trailer?.videoId ?? null}
        title={trailer?.title ?? ""}
        onClose={() => setTrailer(null)}
      />
      <VideoPlayer
        contentId={video?.contentId ?? null}
        title={video?.title ?? ""}
        season={video?.season}
        episode={video?.episode}
        tmdbId={video?.tmdbId}
        tmdbType={video?.tmdbType}
        onClose={() => setVideo(null)}
      />
    </main>
  );
}

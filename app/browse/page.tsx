"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { allContent, allGenres } from "@/data/content";
import type { ContentItem } from "@/data/content";
import ContentCard from "@/app/components/ContentCard";
import TitleModal from "@/app/components/TitleModal";
import TrailerPlayer from "@/app/components/TrailerPlayer";
import VideoPlayer from "@/app/components/VideoPlayer";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "movie" | "series">("all");
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [trailer, setTrailer] = useState<{ videoId: string; title: string } | null>(null);
  const [video, setVideo] = useState<{ contentId: string; title: string; season: number; episode: number } | null>(null);

  const handlePlay = (item: ContentItem, trailerKey?: string) => {
    const vid = trailerKey ?? item.trailerYouTubeId;
    if (vid) setTrailer({ videoId: vid, title: item.title });
  };

  const handleWatch = (item: ContentItem, season = 1, episode = 1) => {
    setSelected(null);
    setVideo({ contentId: item.id, title: item.title, season, episode });
  };

  const filtered = useMemo(() => {
    return allContent.filter((item) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.synopsis.toLowerCase().includes(q) ||
        item.genres.some((g) => g.toLowerCase().includes(q));
      const matchesGenre = genre === "All" || item.genres.includes(genre);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      return matchesQuery && matchesGenre && matchesType;
    });
  }, [query, genre, typeFilter]);

  return (
    <main className="min-h-screen bg-base pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Browse</h1>
          <p className="text-text-secondary text-base">
            Discover {allContent.length} titles · Find where to watch legally
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
          <input
            type="search"
            placeholder="Search titles, genres, cast…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface border border-border-subtle rounded-xl py-4 pl-12 pr-12 text-white placeholder-text-muted text-base focus:outline-none focus:border-accent-purple transition-colors"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            {(["all", "series", "movie"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                  typeFilter === t
                    ? "bg-white text-black"
                    : "bg-surface border border-border-subtle text-text-secondary hover:text-white hover:border-white/30"
                }`}
              >
                {t === "all" ? "All Types" : t === "series" ? "Series" : "Movies"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {allGenres.map((g) => (
              <motion.button
                key={g}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGenre(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  genre === g
                    ? "bg-gradient-to-r from-accent-purple to-purple-500 text-white shadow-lg shadow-accent-purple/25"
                    : "bg-surface border border-border-subtle text-text-secondary hover:text-white hover:border-white/30"
                }`}
              >
                {g}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <div className="flex items-center justify-between">
          <p className="text-text-muted text-sm">
            {filtered.length === 0 ? "No results" : `${filtered.length} title${filtered.length !== 1 ? "s" : ""}`}
            {(query || genre !== "All" || typeFilter !== "all") && " found"}
          </p>
          {(query || genre !== "All" || typeFilter !== "all") && (
            <button
              onClick={() => { setQuery(""); setGenre("All"); setTypeFilter("all"); }}
              className="text-xs text-accent-purple hover:text-accent-purple-light transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                >
                  <ContentCard item={item} onSelect={setSelected} onPlay={handlePlay} index={i} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 space-y-4 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center">
                <Search className="w-8 h-8 text-text-muted" />
              </div>
              <p className="text-white font-semibold text-lg">No titles found</p>
              <p className="text-text-muted text-sm max-w-xs">Try different keywords or remove some filters</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
        onClose={() => setVideo(null)}
      />
    </main>
  );
}

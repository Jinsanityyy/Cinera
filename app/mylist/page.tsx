"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useMyList } from "@/app/hooks/useMyList";
import ContentCard from "@/app/components/ContentCard";
import TitleModal from "@/app/components/TitleModal";
import TrailerPlayer from "@/app/components/TrailerPlayer";
import VideoPlayer from "@/app/components/VideoPlayer";
import type { ContentItem } from "@/data/content";

export default function MyListPage() {
  const { list, loaded } = useMyList();
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

  return (
    <main className="min-h-screen bg-base pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between"
        >
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">My List</h1>
            <p className="text-text-secondary">
              {loaded
                ? list.length > 0
                  ? `${list.length} title${list.length !== 1 ? "s" : ""} saved`
                  : "Your watchlist is empty"
                : "Loading…"}
            </p>
          </div>
          {list.length > 0 && (
            <span className="text-text-muted text-sm">Recently added first</span>
          )}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {!loaded ? (
            <motion.div
              key="loading"
              className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
              ))}
            </motion.div>
          ) : list.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 space-y-6 text-center"
            >
              <div className="relative w-28 h-28 rounded-2xl bg-surface-2 flex items-center justify-center">
                <Heart className="w-12 h-12 text-text-muted" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center shadow-lg">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-white font-bold text-2xl">Start your list</p>
                <p className="text-text-muted max-w-sm text-sm leading-relaxed">
                  Add shows and movies to your list and they&apos;ll appear here for easy access
                </p>
              </div>
              <Link
                href="/browse"
                className="px-6 py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
              >
                Browse Content
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              layout
              className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4"
            >
              {list.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                >
                  <ContentCard item={item} onSelect={setSelected} onPlay={handlePlay} index={i} />
                </motion.div>
              ))}
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

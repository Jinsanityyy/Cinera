"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, List } from "lucide-react";
import type { ReelSeries, ReelEpisode } from "@/data/reels";

interface ReelsViewerProps {
  series: ReelSeries | null;
  initialEpisode?: number;
  onClose: () => void;
}

export default function ReelsViewer({ series, initialEpisode = 1, onClose }: ReelsViewerProps) {
  const [currentEpIndex, setCurrentEpIndex] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset episode when series changes
  useEffect(() => {
    if (!series) return;
    const idx = series.episodes.findIndex((ep) => ep.number === initialEpisode);
    setCurrentEpIndex(idx >= 0 ? idx : 0);
    setListOpen(false);
  }, [series?.id, initialEpisode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll
  useEffect(() => {
    if (!series) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [series]);

  // Keyboard navigation
  useEffect(() => {
    if (!series) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (listOpen) setListOpen(false);
        else onClose();
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [series, listOpen, currentEpIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToNext = useCallback(() => {
    if (!series) return;
    setCurrentEpIndex((i) => Math.min(i + 1, series.episodes.length - 1));
  }, [series]);

  const goToPrev = useCallback(() => {
    setCurrentEpIndex((i) => Math.max(i - 1, 0));
  }, []);

  if (!series) return null;

  const episode: ReelEpisode | undefined = series.episodes[currentEpIndex];
  if (!episode) return null;

  const embedUrl = `https://www.youtube.com/embed/${episode.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  const hasPrev = currentEpIndex > 0;
  const hasNext = currentEpIndex < series.episodes.length - 1;

  return (
    <AnimatePresence>
      {series && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Main viewer ── */}
          <div className="relative w-full h-full lg:w-auto lg:h-full lg:max-h-screen flex lg:flex-row items-stretch">

            {/* Portrait video panel */}
            <div className="relative flex-1 lg:flex-none lg:w-[min(100vw,420px)] flex flex-col bg-black">

              {/* Video embed — fills portrait space */}
              <div className="flex-1 relative overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.iframe
                    key={`${series.id}-ep${episode.number}`}
                    src={embedUrl}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                    title={`${series.title} — ${episode.title}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Top bar overlay */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-widest truncate">
                      {series.genre}
                    </p>
                    <h2 className="text-white font-black text-base leading-tight truncate">
                      {series.title}
                    </h2>
                  </div>
                  <button
                    ref={closeRef}
                    onClick={onClose}
                    className="flex-shrink-0 w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom overlay — episode info + controls */}
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pb-5">
                  <div className="flex items-end justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-xs font-semibold mb-0.5">
                        Episode {episode.number} · {episode.duration}
                      </p>
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                        {episode.title}
                      </h3>
                      {episode.synopsis && (
                        <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {episode.synopsis}
                        </p>
                      )}
                    </div>

                    {/* Vertical nav arrows */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={goToPrev}
                        disabled={!hasPrev}
                        className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/25 transition-colors"
                        aria-label="Previous episode"
                      >
                        <ChevronUp className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={goToNext}
                        disabled={!hasNext}
                        className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/25 transition-colors"
                        aria-label="Next episode"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setListOpen((o) => !o)}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center text-white transition-colors ${
                          listOpen
                            ? "bg-accent-purple border-accent-purple"
                            : "bg-white/15 border-white/20 hover:bg-white/25"
                        }`}
                        aria-label="Episode list"
                      >
                        <List className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Desktop sidebar episode list ── */}
            <AnimatePresence>
              {listOpen && (
                <motion.div
                  className="hidden lg:flex flex-col w-72 bg-surface border-l border-white/10 overflow-hidden"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 288, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">Episodes</h3>
                    <button
                      onClick={() => setListOpen(false)}
                      className="text-zinc-500 hover:text-white transition-colors"
                      aria-label="Close episode list"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div ref={listRef} className="flex-1 overflow-y-auto py-2">
                    {series.episodes.map((ep, idx) => (
                      <EpisodeListItem
                        key={ep.number}
                        episode={ep}
                        isActive={idx === currentEpIndex}
                        accentColor={series.accentColor}
                        onClick={() => setCurrentEpIndex(idx)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Mobile bottom-sheet episode list ── */}
          <AnimatePresence>
            {listOpen && (
              <>
                {/* Backdrop tap to close */}
                <motion.div
                  className="lg:hidden absolute inset-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setListOpen(false)}
                />
                <motion.div
                  className="lg:hidden absolute bottom-0 left-0 right-0 z-20 bg-surface rounded-t-2xl border-t border-white/10 max-h-[65vh] flex flex-col"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                >
                  {/* Handle */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                  </div>
                  <div className="px-4 pb-3 flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">Episodes — {series.title}</h3>
                    <button
                      onClick={() => setListOpen(false)}
                      className="text-zinc-500 hover:text-white transition-colors"
                      aria-label="Close episode list"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pb-safe-bottom">
                    {series.episodes.map((ep, idx) => (
                      <EpisodeListItem
                        key={ep.number}
                        episode={ep}
                        isActive={idx === currentEpIndex}
                        accentColor={series.accentColor}
                        onClick={() => {
                          setCurrentEpIndex(idx);
                          setListOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Episode list item ─────────────────────────────────────────────────────────
function EpisodeListItem({
  episode,
  isActive,
  accentColor,
  onClick,
}: {
  episode: ReelEpisode;
  isActive: boolean;
  accentColor: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
        isActive ? "bg-white/10" : ""
      }`}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
        style={
          isActive
            ? { backgroundColor: accentColor, color: "#fff" }
            : { backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }
        }
      >
        {episode.number}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-sm leading-tight truncate"
          style={{ color: isActive ? accentColor : "#f4f4f5" }}
        >
          {episode.title}
        </p>
        <p className="text-zinc-500 text-xs mt-0.5">{episode.duration}</p>
        {episode.synopsis && (
          <p className="text-zinc-600 text-xs mt-1 line-clamp-2 leading-relaxed">
            {episode.synopsis}
          </p>
        )}
      </div>
    </motion.button>
  );
}

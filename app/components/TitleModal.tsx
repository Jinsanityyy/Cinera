"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Plus, Check, Share2 } from "lucide-react";
import { ContentItem } from "@/data/content";
import { useMyList } from "@/app/hooks/useMyList";

interface TitleModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export default function TitleModal({ item, onClose }: TitleModalProps) {
  const [selectedSeason, setSelectedSeason] = useState(0);
  const { isInList, toggle } = useMyList();
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const inList = item ? isInList(item.id) : false;

  // Reset on item change
  useEffect(() => {
    setSelectedSeason(0);
  }, [item?.id]);

  // Keyboard trap & Esc
  useEffect(() => {
    if (!item) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/75 modal-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            className="relative z-10 w-full sm:max-w-3xl lg:max-w-4xl bg-surface rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Hero area */}
            <div className="relative flex-shrink-0">
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                {/* YouTube iframe */}
                <iframe
                  src={`https://www.youtube.com/embed/${item.trailerYouTubeId}?autoplay=0&mute=1&controls=1&rel=0&modestbranding=1`}
                  title={`${item.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Close button */}
              <button
                ref={closeRef}
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              <div className="px-6 sm:px-8 pb-8 space-y-6">
                {/* Title + actions */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                      {item.title}
                    </h2>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`text-sm font-bold ${item.matchPercent >= 90 ? "text-green-400" : "text-yellow-400"}`}>
                        {item.matchPercent}% Match
                      </span>
                      <span className="text-sm text-white/50">{item.year}</span>
                      {item.type === "series" && item.seasons && (
                        <span className="text-sm text-white/50">
                          {item.seasons.length} Season{item.seasons.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {item.type === "movie" && item.duration && (
                        <span className="text-sm text-white/50">{item.duration}</span>
                      )}
                      <span className="text-xs border border-white/20 text-white/50 px-1.5 py-0.5 rounded">
                        {item.maturityRating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-sm rounded-lg"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      Play
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggle(item)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                        inList
                          ? "bg-white/20 border-white/30 text-white"
                          : "bg-transparent border-white/20 text-white/70 hover:text-white hover:border-white/40"
                      }`}
                      aria-label={inList ? "Remove from list" : "Add to list"}
                    >
                      {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 flex items-center justify-center transition-colors"
                      aria-label="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Synopsis */}
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                  {item.synopsis}
                </p>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {item.cast && (
                    <div>
                      <span className="text-white/40 font-medium">Cast: </span>
                      <span className="text-white/75">{item.cast.join(", ")}</span>
                    </div>
                  )}
                  {item.creator && (
                    <div>
                      <span className="text-white/40 font-medium">Creator: </span>
                      <span className="text-white/75">{item.creator}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-white/40 font-medium">Genres: </span>
                    <span className="text-white/75">{item.genres.join(", ")}</span>
                  </div>
                  {item.tagline && (
                    <div>
                      <span className="text-white/40 font-medium italic">&ldquo;{item.tagline}&rdquo;</span>
                    </div>
                  )}
                </div>

                {/* Episodes / Seasons (for series) */}
                {item.type === "series" && item.seasons && item.seasons.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-lg">Episodes</h3>
                      {item.seasons.length > 1 && (
                        <select
                          value={selectedSeason}
                          onChange={(e) => setSelectedSeason(Number(e.target.value))}
                          className="bg-surface-3 border border-border-subtle text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent-purple"
                        >
                          {item.seasons.map((s, i) => (
                            <option key={s.id} value={i}>
                              Season {s.number}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {item.seasons[selectedSeason]?.episodes.map((ep) => (
                        <motion.div
                          key={ep.id}
                          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                          className="flex gap-3 rounded-xl p-3 cursor-pointer transition-colors group/ep"
                        >
                          {/* Thumbnail */}
                          <div className="relative flex-shrink-0 w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-surface-3">
                            <Image
                              src={ep.thumbnailUrl}
                              alt={ep.title}
                              fill
                              className="object-cover"
                              sizes="144px"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/ep:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="text-white font-semibold text-sm truncate">
                                {ep.episode}. {ep.title}
                              </p>
                              <span className="text-white/40 text-xs flex-shrink-0">{ep.runtime}m</span>
                            </div>
                            <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                              {ep.synopsis}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

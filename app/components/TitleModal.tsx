"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Plus, Check, Share2, Film, Loader2, Clock, MonitorPlay } from "lucide-react";
import { ContentItem } from "@/data/content";
import { useMyList } from "@/app/hooks/useMyList";
import { useTMDB } from "@/app/hooks/useTMDB";
import { useTMDBSeason } from "@/app/hooks/useTMDBSeason";
import type { TMDBSeason } from "@/lib/tmdb";

interface TitleModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onPlay: (item: ContentItem, trailerKey?: string) => void;
  onWatch: (item: ContentItem, season?: number, episode?: number) => void;
}

export default function TitleModal({ item, onClose, onPlay, onWatch }: TitleModalProps) {
  const [selectedSeason, setSelectedSeason] = useState(0);
  const { isInList, toggle } = useMyList();
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: tmdbData } = useTMDB(
    item?.tmdbId,
    item?.tmdbType,
    !!item
  );

  // Seasons from TMDB — no hardcoded data
  const tmdbSeasons: TMDBSeason[] | null =
    item?.type === "series" ? (tmdbData?.seasons ?? null) : null;
  const currentSeasonNumber = tmdbSeasons?.[selectedSeason]?.number ?? 1;

  const { episodes: tmdbEpisodes, loading: epLoading } = useTMDBSeason(
    item?.tmdbId ?? null,
    currentSeasonNumber,
    !!item && item.type === "series" && !!tmdbSeasons?.length
  );

  const inList = item ? isInList(item.id) : false;

  useEffect(() => {
    setSelectedSeason(0);
  }, [item?.id]);

  // Keyboard trap + Esc
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

  const trailerKey = tmdbData?.trailerKey ?? item?.trailerYouTubeId;
  const backdropSrc = tmdbData?.backdropUrl ?? null;


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
            className="absolute inset-0 bg-black/80 modal-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal panel */}
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
            {/* ── Hero backdrop ── */}
            <div className="relative flex-shrink-0">
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-surface-2">
                {backdropSrc ? (
                  <Image
                    src={backdropSrc}
                    alt={item.title}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 896px"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 skeleton opacity-60" />
                )}

                {/* Heavy scrim — fully covers bottom so body text never touches the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-black/10" />

                {/* Play trailer overlay */}
                {trailerKey && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPlay(item, trailerKey)}
                    className="absolute inset-0 flex items-center justify-center group"
                    aria-label="Play trailer"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/35 transition-colors shadow-2xl">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </motion.button>
                )}
              </div>

              {/* Close */}
              <button
                ref={closeRef}
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 bg-surface">
              <div className="px-6 sm:px-8 pb-8 space-y-6">

                {/* ── Title + action row ── */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                      {item.title}
                    </h2>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`text-sm font-bold ${item.matchPercent >= 90 ? "text-green-400" : "text-yellow-400"}`}>
                        {item.matchPercent}% Match
                      </span>
                      <span className="text-sm text-zinc-400">{item.year}</span>
                      {item.type === "series" && tmdbSeasons && tmdbSeasons.length > 0 && (
                        <span className="text-sm text-zinc-400">
                          {tmdbSeasons.length} Season{tmdbSeasons.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {item.type === "movie" && tmdbData?.runtime && (
                        <span className="text-sm text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />{tmdbData.runtime}m
                        </span>
                      )}
                      {item.type === "movie" && !tmdbData?.runtime && item.duration && (
                        <span className="text-sm text-zinc-400">{item.duration}</span>
                      )}
                      <span className="text-xs border border-white/30 text-zinc-400 px-1.5 py-0.5 rounded">
                        {item.maturityRating}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* PRIMARY: Watch Now → internal multi-server player */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onWatch(item)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-accent-purple text-white font-bold text-sm rounded-lg shadow-lg shadow-accent-purple/25 hover:bg-accent-purple/90 transition-colors"
                    >
                      <MonitorPlay className="w-4 h-4" />
                      Watch Now
                    </motion.button>

                    {/* SECONDARY: Trailer */}
                    {trailerKey ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPlay(item, trailerKey)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-lg hover:bg-white/20 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Trailer
                      </motion.button>
                    ) : null}

                    {/* My List */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggle(item)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                        inList
                          ? "bg-white/20 border-white/30 text-white"
                          : "bg-transparent border-white/20 text-zinc-400 hover:text-white hover:border-white/40"
                      }`}
                      aria-label={inList ? "Remove from list" : "Add to list"}
                    >
                      {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </motion.button>

                    {/* Share */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full border border-white/20 text-zinc-400 hover:text-white hover:border-white/40 flex items-center justify-center transition-colors"
                      aria-label="Share"
                      onClick={() => { if (navigator.share) navigator.share({ title: item.title, text: item.synopsis }); }}
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* ── Synopsis ── */}
                <p className="text-white leading-relaxed text-sm sm:text-base">{item.synopsis}</p>

                {/* ── Details ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {item.cast && (
                    <div>
                      <span className="text-zinc-500 font-medium">Cast · </span>
                      <span className="text-white">{item.cast.join(", ")}</span>
                    </div>
                  )}
                  {item.creator && (
                    <div>
                      <span className="text-zinc-500 font-medium">Creator · </span>
                      <span className="text-white">{item.creator}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-zinc-500 font-medium">Genres · </span>
                    <span className="text-white">{item.genres.join(", ")}</span>
                  </div>
                  {item.tagline && (
                    <div className="sm:col-span-2">
                      <span className="text-zinc-400 italic text-sm">&ldquo;{item.tagline}&rdquo;</span>
                    </div>
                  )}
                </div>

                {/* ── Episodes (TV only, TMDB-driven) ── */}
                {item.type === "series" && (tmdbSeasons?.length ?? 0) > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-lg">Episodes</h3>
                      {(tmdbSeasons!.length > 1) && (
                        <select
                          value={selectedSeason}
                          onChange={(e) => setSelectedSeason(Number(e.target.value))}
                          className="bg-surface-3 border border-border-subtle text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-accent-purple"
                        >
                          {tmdbSeasons!.map((s, i) => (
                            <option key={s.number} value={i}>
                              Season {s.number}{s.year ? ` (${s.year})` : ""}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Episode list — explicit dark surface for legibility */}
                    <div className="rounded-xl bg-zinc-900/80 overflow-hidden border border-white/5">
                      <div className="max-h-72 overflow-y-auto">
                        {epLoading ? (
                          <div className="flex items-center gap-3 py-8 px-4 text-zinc-500">
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            <span className="text-sm">Loading episodes…</span>
                          </div>
                        ) : tmdbEpisodes.length === 0 ? (
                          <p className="text-zinc-500 text-sm py-8 text-center">No episode data available</p>
                        ) : tmdbEpisodes.map((ep, idx) => (
                          <motion.div
                            key={ep.number}
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                            className={`flex gap-3 p-3 cursor-pointer group/ep ${
                              idx < tmdbEpisodes.length - 1 ? "border-b border-white/5" : ""
                            }`}
                            onClick={() => onWatch(item, currentSeasonNumber, ep.number)}
                          >
                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0 w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-zinc-800">
                              {ep.stillUrl ? (
                                <Image
                                  src={ep.stillUrl}
                                  alt={ep.title}
                                  fill
                                  className="object-cover"
                                  sizes="144px"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Film className="w-6 h-6 text-zinc-600" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/ep:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0 space-y-1 py-0.5">
                              <div className="flex items-baseline justify-between gap-2">
                                <p className="text-white font-semibold text-sm truncate">
                                  {ep.number}. {ep.title}
                                </p>
                                {ep.runtime && (
                                  <span className="text-zinc-400 text-xs flex-shrink-0">{ep.runtime}m</span>
                                )}
                              </div>
                              <p className="text-white/90 text-xs leading-relaxed line-clamp-2">{ep.synopsis}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
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

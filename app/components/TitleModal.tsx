"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Plus, Check, Share2, Film, Loader2, Clock, MonitorPlay, ChevronLeft } from "lucide-react";
import { ContentItem } from "@/data/content";
import { useMyList } from "@/app/hooks/useMyList";
import { useTMDB } from "@/app/hooks/useTMDB";
import { useTMDBSeason } from "@/app/hooks/useTMDBSeason";
import { useTMDBRecommendations } from "@/app/hooks/useTMDBRecommendations";
import type { TMDBSeason, TMDBCastMember, TMDBRecommendation } from "@/lib/tmdb";

interface TitleModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onPlay: (item: ContentItem, trailerKey?: string) => void;
  onWatch: (item: ContentItem, season?: number, episode?: number) => void;
}

// Build a minimal ContentItem from a TMDB recommendation for modal navigation
function recToItem(rec: TMDBRecommendation): ContentItem {
  return {
    id: `tmdb-${rec.tmdbId}`,
    title: rec.title,
    type: rec.tmdbType === "movie" ? "movie" : "series",
    tmdbId: rec.tmdbId,
    tmdbType: rec.tmdbType,
    backdropUrl: rec.backdropUrl ?? "from-slate-900 via-zinc-900 to-slate-950",
    posterUrl: rec.posterUrl ?? "from-slate-900 via-zinc-900 to-slate-950",
    synopsis: rec.overview,
    year: rec.year ?? 0,
    maturityRating: "NR",
    genres: [],
    matchPercent: Math.min(99, Math.max(60, Math.round((rec.voteAverage ?? 0) * 10))),
    trailerYouTubeId: "",
  };
}

// ── Cast avatar card ──────────────────────────────────────────────────────────
function CastCard({ member }: { member: TMDBCastMember }) {
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(" ").map((w) => w[0] ?? "").slice(0, 2).join("");

  return (
    <div className="flex-shrink-0 w-20 text-center space-y-1.5">
      <div className="w-14 h-14 rounded-full mx-auto overflow-hidden bg-zinc-700 flex items-center justify-center">
        {member.profileUrl && !imgError ? (
          <Image
            src={member.profileUrl}
            alt={member.name}
            width={56}
            height={56}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-white font-bold text-sm">{initials}</span>
        )}
      </div>
      <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2">{member.name}</p>
      <p className="text-zinc-500 text-[9px] leading-tight line-clamp-2">{member.character}</p>
    </div>
  );
}

// ── Recommendation poster card ────────────────────────────────────────────────
function RecCard({ rec, onClick }: { rec: TMDBRecommendation; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  const matchPct = Math.min(99, Math.max(60, Math.round((rec.voteAverage ?? 0) * 10)));

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex-shrink-0 w-32 text-left group/rec"
    >
      <div className="relative w-32 aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 mb-1.5">
        {rec.posterUrl && !imgError ? (
          <Image
            src={rec.posterUrl}
            alt={rec.title}
            fill
            className="object-cover group-hover/rec:scale-105 transition-transform duration-300"
            sizes="128px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-end p-2">
            <span className="text-white/60 text-xs font-semibold line-clamp-3">{rec.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{rec.title}</p>
      <p className={`text-[10px] font-bold mt-0.5 ${matchPct >= 90 ? "text-green-400" : "text-yellow-400"}`}>
        {matchPct}% Match
      </p>
    </motion.button>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function TitleModal({ item, onClose, onPlay, onWatch }: TitleModalProps) {
  // History stack — item prop is the root; internal navigation pushes onto stack
  const [stack, setStack] = useState<ContentItem[]>([]);
  const current = stack[stack.length - 1] ?? null;
  const canGoBack = stack.length > 1;

  useEffect(() => {
    if (item) setStack([item]);
    else setStack([]);
  }, [item?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = useCallback((next: ContentItem) => {
    setStack((prev) => [...prev, next]);
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const [selectedSeason, setSelectedSeason] = useState(0);
  const { isInList, toggle } = useMyList();
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: tmdbData, matchPercent: tmdbMatchPercent } = useTMDB(
    current?.tmdbId,
    current?.tmdbType,
    !!current,
    current?.title,
    current?.year,
  );

  const tmdbSeasons: TMDBSeason[] | null =
    current?.type === "series" ? (tmdbData?.seasons ?? null) : null;
  const currentSeasonNumber = tmdbSeasons?.[selectedSeason]?.number ?? 1;

  const { episodes: tmdbEpisodes, loading: epLoading } = useTMDBSeason(
    current?.tmdbId ?? null,
    currentSeasonNumber,
    !!current && current.type === "series" && !!tmdbSeasons?.length,
  );

  const { recommendations } = useTMDBRecommendations(
    current?.tmdbId,
    current?.tmdbType,
    !!current,
  );

  const inList = current ? isInList(current.id) : false;
  const matchPercent = tmdbMatchPercent ?? current?.matchPercent ?? 0;
  const trailerKey = tmdbData?.trailerKey ?? current?.trailerYouTubeId ?? null;
  const backdropSrc = tmdbData?.backdropUrl ?? null;
  const castMembers: TMDBCastMember[] = tmdbData?.cast ?? [];

  useEffect(() => {
    setSelectedSeason(0);
  }, [current?.id]);

  // Keyboard trap + Esc
  useEffect(() => {
    if (!current) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (canGoBack) goBack();
        else onClose();
      }
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
  }, [current, onClose, canGoBack, goBack]);

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
            aria-label={current?.title ?? ""}
            className="relative z-10 w-full sm:max-w-3xl lg:max-w-4xl bg-surface rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* ── Hero backdrop ── */}
            <div className="relative flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.id}
                  className="relative w-full aspect-[16/9] overflow-hidden bg-surface-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {backdropSrc ? (
                    <Image
                      src={backdropSrc}
                      alt={current?.title ?? ""}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 896px"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 skeleton opacity-60" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-black/10" />

                  {trailerKey && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => current && onPlay(current, trailerKey)}
                      className="absolute inset-0 flex items-center justify-center group"
                      aria-label="Play trailer"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/35 transition-colors shadow-2xl">
                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                      </div>
                    </motion.button>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Back button */}
              {canGoBack && (
                <button
                  onClick={goBack}
                  className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}

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
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="px-6 sm:px-8 pb-8 space-y-6"
                >
                  {/* ── Title + action row ── */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
                    <div className="space-y-2">
                      <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                        {current?.title}
                      </h2>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className={`text-sm font-bold ${matchPercent >= 90 ? "text-green-400" : "text-yellow-400"}`}>
                          {matchPercent}% Match
                        </span>
                        <span className="text-sm text-zinc-400">{current?.year}</span>
                        {current?.type === "series" && tmdbSeasons && tmdbSeasons.length > 0 && (
                          <span className="text-sm text-zinc-400">
                            {tmdbSeasons.length} Season{tmdbSeasons.length !== 1 ? "s" : ""}
                          </span>
                        )}
                        {current?.type === "movie" && tmdbData?.runtime && (
                          <span className="text-sm text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />{tmdbData.runtime}m
                          </span>
                        )}
                        {current?.type === "movie" && !tmdbData?.runtime && current?.duration && (
                          <span className="text-sm text-zinc-400">{current.duration}</span>
                        )}
                        <span className="text-xs border border-white/30 text-zinc-400 px-1.5 py-0.5 rounded">
                          {current?.maturityRating}
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => current && onWatch(current)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent-purple text-white font-bold text-sm rounded-lg shadow-lg shadow-accent-purple/25 hover:bg-accent-purple/90 transition-colors"
                      >
                        <MonitorPlay className="w-4 h-4" />
                        Watch Now
                      </motion.button>

                      {trailerKey ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => current && onPlay(current, trailerKey)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-lg hover:bg-white/20 transition-all"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          Trailer
                        </motion.button>
                      ) : null}

                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => current && toggle(current)}
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                          inList
                            ? "bg-white/20 border-white/30 text-white"
                            : "bg-transparent border-white/20 text-zinc-400 hover:text-white hover:border-white/40"
                        }`}
                        aria-label={inList ? "Remove from list" : "Add to list"}
                      >
                        {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full border border-white/20 text-zinc-400 hover:text-white hover:border-white/40 flex items-center justify-center transition-colors"
                        aria-label="Share"
                        onClick={() => {
                          if (navigator.share && current)
                            navigator.share({ title: current.title, text: current.synopsis });
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* ── Synopsis ── */}
                  <p style={{ color: "#f4f4f5" }} className="leading-relaxed text-sm sm:text-base">
                    {current?.synopsis}
                  </p>

                  {/* ── Details ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {current?.genres && current.genres.length > 0 && (
                      <div>
                        <span style={{ color: "#71717a" }} className="font-medium">Genres · </span>
                        <span style={{ color: "#f4f4f5" }}>{current.genres.join(", ")}</span>
                      </div>
                    )}
                    {current?.creator && (
                      <div>
                        <span style={{ color: "#71717a" }} className="font-medium">Creator · </span>
                        <span style={{ color: "#f4f4f5" }}>{current.creator}</span>
                      </div>
                    )}
                    {current?.tagline && (
                      <div className="sm:col-span-2">
                        <span style={{ color: "#a1a1aa" }} className="italic text-sm">&ldquo;{current.tagline}&rdquo;</span>
                      </div>
                    )}
                  </div>

                  {/* ── Cast with photos ── */}
                  {castMembers.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-white font-bold text-base">Cast</h3>
                      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                        {castMembers.map((member) => (
                          <CastCard key={member.id} member={member} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback text cast when TMDB cast hasn't loaded or is empty */}
                  {castMembers.length === 0 && current?.cast && current.cast.length > 0 && (
                    <div className="text-sm">
                      <span style={{ color: "#71717a" }} className="font-medium">Cast · </span>
                      <span style={{ color: "#f4f4f5" }}>{current.cast.join(", ")}</span>
                    </div>
                  )}

                  {/* ── Episodes (TV only, TMDB-driven) ── */}
                  {current?.type === "series" && (tmdbSeasons?.length ?? 0) > 0 && (
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

                      <div className="rounded-xl bg-zinc-900/80 overflow-hidden border border-white/5">
                        <div className="max-h-72 overflow-y-auto">
                          {epLoading ? (
                            <div className="flex items-center gap-3 py-8 px-4 text-zinc-500">
                              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                              <span className="text-sm">Loading episodes…</span>
                            </div>
                          ) : tmdbEpisodes.length === 0 ? (
                            <p className="text-zinc-500 text-sm py-8 text-center">No episode data available</p>
                          ) : (
                            tmdbEpisodes.map((ep, idx) => (
                              <motion.div
                                key={ep.number}
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                                className={`flex gap-3 p-3 cursor-pointer group/ep ${
                                  idx < tmdbEpisodes.length - 1 ? "border-b border-white/5" : ""
                                }`}
                                onClick={() => current && onWatch(current, currentSeasonNumber, ep.number)}
                              >
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

                                <div className="flex-1 min-w-0 space-y-1 py-0.5">
                                  <div className="flex items-baseline justify-between gap-2">
                                    <p className="text-white font-semibold text-sm truncate">
                                      {ep.number}. {ep.title}
                                    </p>
                                    {ep.runtime && (
                                      <span className="text-zinc-400 text-xs flex-shrink-0">{ep.runtime}m</span>
                                    )}
                                  </div>
                                  <p style={{ color: "rgba(244,244,245,0.85)" }} className="text-xs leading-relaxed line-clamp-2">
                                    {ep.synopsis}
                                  </p>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── More Like This ── */}
                  {recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-white font-bold text-lg">More Like This</h3>
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                        {recommendations.map((rec) => (
                          <RecCard
                            key={rec.tmdbId}
                            rec={rec}
                            onClick={() => navigateTo(recToItem(rec))}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

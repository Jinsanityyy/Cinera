"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Plus, Check, Share2, ExternalLink, Tv2, Film, Loader2, MonitorPlay } from "lucide-react";
import { ContentItem } from "@/data/content";
import { useMyList } from "@/app/hooks/useMyList";
import { useTMDB, type TMDBData } from "@/app/hooks/useTMDB";

interface TitleModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onPlay: (item: ContentItem, trailerKey?: string) => void;
  onWatch: (item: ContentItem) => void;
}

// ─── Where to Watch section ──────────────────────────────────────────────────

function WatchProviders({ tmdbData, loading }: { tmdbData: TMDBData | null; loading: boolean }) {
  const streaming = tmdbData?.providers.filter((p) => p.type === "flatrate") ?? [];
  const rent = tmdbData?.providers.filter((p) => p.type === "rent") ?? [];
  const buy = tmdbData?.providers.filter((p) => p.type === "buy") ?? [];
  const hasAny = streaming.length > 0 || rent.length > 0 || buy.length > 0;

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-2">
        <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
        <span className="text-white/30 text-sm">Checking availability…</span>
      </div>
    );
  }

  if (!hasAny) {
    return (
      <p className="text-white/30 text-sm italic">
        Availability data not found for your region. Try searching on{" "}
        <a
          href="https://www.justwatch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-purple-light hover:underline"
        >
          JustWatch
        </a>
        .
      </p>
    );
  }

  const ProviderGroup = ({
    label,
    providers,
  }: {
    label: string;
    providers: TMDBData["providers"];
  }) =>
    providers.length > 0 ? (
      <div className="space-y-2">
        <p className="text-white/35 text-xs font-semibold uppercase tracking-widest">{label}</p>
        <div className="flex flex-wrap gap-2">
          {providers.map((p) => (
            <motion.a
              key={p.id}
              href={p.link || "https://www.justwatch.com"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title={`Watch on ${p.name}`}
              className="group relative w-11 h-11 rounded-xl overflow-hidden border border-white/10 hover:border-accent-purple/50 transition-colors shadow-md flex-shrink-0"
            >
              <Image
                src={p.logoUrl}
                alt={p.name}
                fill
                className="object-cover"
                sizes="44px"
              />
              {/* Tooltip */}
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-surface-3 border border-border-subtle text-white text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                {p.name}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-4">
      <ProviderGroup label="Stream" providers={streaming} />
      <ProviderGroup label="Rent" providers={rent} />
      <ProviderGroup label="Buy" providers={buy} />
      <p className="text-white/25 text-[10px]">
        Availability shown for US region · Powered by TMDB &amp; JustWatch
      </p>
    </div>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────

export default function TitleModal({ item, onClose, onPlay, onWatch }: TitleModalProps) {
  const [selectedSeason, setSelectedSeason] = useState(0);
  const { isInList, toggle } = useMyList();
  const closeRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch full TMDB data when modal opens
  const { data: tmdbData, loading: tmdbLoading } = useTMDB(
    item?.tmdbId,
    item?.tmdbType,
    !!item
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
            {/* ── Hero: TMDB backdrop ── */}
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

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

                {/* Play trailer overlay button */}
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

              {/* Close button */}
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
            <div className="overflow-y-auto flex-1">
              <div className="px-6 sm:px-8 pb-8 space-y-6">
                {/* Title row */}
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
                    {/* Watch Now — opens multi-server video player */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onWatch(item)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-accent-purple text-white font-bold text-sm rounded-lg shadow-lg shadow-accent-purple/25 hover:bg-accent-purple/90 transition-colors"
                    >
                      <MonitorPlay className="w-4 h-4" />
                      Watch Now
                    </motion.button>

                    {trailerKey ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPlay(item, trailerKey)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-sm rounded-lg"
                      >
                        <Play className="w-4 h-4 fill-black" />
                        Trailer
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white/30 font-bold text-sm rounded-lg cursor-default">
                        <Film className="w-4 h-4" />
                        No Trailer
                      </div>
                    )}
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
                      onClick={() => { if (navigator.share) navigator.share({ title: item.title, text: item.synopsis }); }}
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Synopsis */}
                <p className="text-white/80 leading-relaxed text-sm sm:text-base">{item.synopsis}</p>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {item.cast && (
                    <div>
                      <span className="text-white/35 font-medium">Cast · </span>
                      <span className="text-white/70">{item.cast.join(", ")}</span>
                    </div>
                  )}
                  {item.creator && (
                    <div>
                      <span className="text-white/35 font-medium">Creator · </span>
                      <span className="text-white/70">{item.creator}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-white/35 font-medium">Genres · </span>
                    <span className="text-white/70">{item.genres.join(", ")}</span>
                  </div>
                  {item.tagline && (
                    <div className="sm:col-span-2">
                      <span className="text-white/30 italic text-sm">&ldquo;{item.tagline}&rdquo;</span>
                    </div>
                  )}
                </div>

                {/* ── Where to Watch ── */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    <Tv2 className="w-4 h-4 text-accent-purple" />
                    <h3 className="text-white font-bold text-base">Where to Watch</h3>
                    <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest ml-auto">
                      Legal · Licensed
                    </span>
                  </div>

                  <div className="bg-surface-2 rounded-xl p-4 border border-border-subtle">
                    <WatchProviders tmdbData={tmdbData} loading={tmdbLoading} />
                  </div>
                </div>

                {/* ── Episodes ── */}
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
                              Season {s.number} ({s.year})
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
                          className="flex gap-3 rounded-xl p-3 cursor-pointer group/ep"
                        >
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
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="text-white font-semibold text-sm truncate">
                                {ep.episode}. {ep.title}
                              </p>
                              <span className="text-white/40 text-xs flex-shrink-0">{ep.runtime}m</span>
                            </div>
                            <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{ep.synopsis}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Legal note for episodes */}
                    <div className="flex items-start gap-2 p-3 bg-surface-3 rounded-xl border border-border-subtle">
                      <ExternalLink className="w-4 h-4 text-accent-purple mt-0.5 flex-shrink-0" />
                      <p className="text-white/40 text-xs leading-relaxed">
                        CINERA is a discovery platform — full episodes are available on licensed streaming services above.
                        We show trailers and help you find where to watch legally.
                      </p>
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

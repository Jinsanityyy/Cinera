"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Info, Check, List } from "lucide-react";
import { ContentItem } from "@/data/content";
import { useMyList } from "@/app/hooks/useMyList";
import { useTMDB } from "@/app/hooks/useTMDB";

interface HeroBannerProps {
  items: ContentItem[];
  onMoreInfo: (item: ContentItem) => void;
  onPlay: (item: ContentItem, trailerKey?: string) => void;
  modalOpen?: boolean;
}

function HeroBackdrop({ item }: { item: ContentItem }) {
  const { data } = useTMDB(item.tmdbId, item.tmdbType, true);
  const src = data?.backdropUrl ?? null;

  return (
    <div className="absolute inset-0 ken-burns">
      {src ? (
        <Image
          src={src}
          alt={item.title}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${item.backdropUrl}`} />
      )}
    </div>
  );
}

function sendYTCommand(iframe: HTMLIFrameElement | null, func: string) {
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: "command", func, args: [] }),
    "*"
  );
}

export default function HeroBanner({ items, onMoreInfo, onPlay, modalOpen }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [trailerActive, setTrailerActive] = useState(false);
  const [origin, setOrigin] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const activateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deactivateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useRef(false);
  const modalOpenRef = useRef(modalOpen);

  const { isInList, toggle } = useMyList();

  const item = items[current] ?? items[0];
  const { data: tmdbData } = useTMDB(item?.tmdbId, item?.tmdbType, true);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOrigin(encodeURIComponent(window.location.origin));
  }, []);

  useEffect(() => {
    modalOpenRef.current = modalOpen;
  }, [modalOpen]);

  const stopTrailer = useCallback(() => {
    sendYTCommand(iframeRef.current, "mute");
    sendYTCommand(iframeRef.current, "pauseVideo");
    setTrailerActive(false);
  }, []);

  const scheduleTrailer = useCallback(() => {
    if (activateTimer.current) clearTimeout(activateTimer.current);
    if (deactivateTimer.current) clearTimeout(deactivateTimer.current);
    setTrailerActive(false);
    if (reducedMotion.current) return;

    activateTimer.current = setTimeout(() => {
      if (!modalOpenRef.current && !document.hidden) {
        setTrailerActive(true);
        // Unmute after iframe has had time to start playing
        setTimeout(() => sendYTCommand(iframeRef.current, "unMute"), 2000);
      }
      deactivateTimer.current = setTimeout(stopTrailer, 30000);
    }, 3000);
  }, [stopTrailer]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
  }, [items.length]);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 48 && dy < 80) {
      if (dx < 0) next(); else prev();
    }
  };

  useEffect(() => {
    scheduleTrailer();
  }, [current, scheduleTrailer]);

  useEffect(() => {
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [next]);

  // Pause/resume when modal opens or closes
  useEffect(() => {
    if (modalOpen) {
      sendYTCommand(iframeRef.current, "pauseVideo");
    } else if (trailerActive) {
      sendYTCommand(iframeRef.current, "playVideo");
    }
  }, [modalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pause/resume on tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        sendYTCommand(iframeRef.current, "pauseVideo");
      } else if (trailerActive && !modalOpenRef.current) {
        sendYTCommand(iframeRef.current, "playVideo");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [trailerActive]);

  useEffect(() => {
    return () => {
      if (activateTimer.current) clearTimeout(activateTimer.current);
      if (deactivateTimer.current) clearTimeout(deactivateTimer.current);
    };
  }, []);

  if (!item) return null;

  const inList = isInList(item.id);
  const trailerKey = tmdbData?.trailerKey ?? item.trailerYouTubeId;

  const iframeSrc =
    trailerKey && origin
      ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1&rel=0&enablejsapi=1&origin=${origin}&playsinline=1`
      : null;

  return (
    <section
      className="relative w-full h-[42vh] sm:h-[75vh] lg:h-[85vh] min-h-[270px] sm:min-h-[480px] lg:min-h-[560px] max-h-[900px] overflow-hidden bg-base"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <HeroBackdrop item={item} />
        </motion.div>
      </AnimatePresence>

      {/* YouTube trailer — fades over backdrop after 3s, fades out after 30s */}
      <AnimatePresence>
        {trailerActive && iframeSrc && (
          <motion.div
            key="trailer"
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0"
              style={{ width: "max(100%, 177.78vh)", height: "max(100%, 56.25vw)" }}
              title={`${item.title} trailer`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Film grain */}
      <div className="film-grain absolute inset-0 pointer-events-none z-[1]" />

      {/* Vignette */}
      <div className="vignette absolute inset-0 z-[2] pointer-events-none" />

      {/* Scrims */}
      <div className="absolute inset-0 z-[3] hero-scrim pointer-events-none" />
      <div className="absolute inset-0 z-[3] hero-scrim-left pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-base/60 to-transparent z-[3] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-6 sm:pb-20 lg:pb-24 px-4 sm:px-10 lg:px-16 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {/* Badges — hidden on mobile to keep hero compact */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {item.featured && (
                <span className="text-xs font-bold tracking-widest text-accent-purple uppercase">
                  ★ Featured
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 bg-white/10 border border-white/10 px-2 py-0.5 rounded">
                {item.maturityRating}
              </span>
              {item.type === "series" && (
                <span className="text-sm text-white/60 font-medium">Series</span>
              )}
              {item.type === "movie" && item.duration && (
                <span className="text-sm text-white/60 font-medium">{item.duration}</span>
              )}
              <span className="text-sm text-white/50">{item.year}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
              {item.title}
            </h1>

            {/* Tagline — hidden on mobile */}
            {item.tagline && (
              <p className="hidden lg:block text-base lg:text-lg text-accent-purple-light font-medium italic tracking-wide">
                &ldquo;{item.tagline}&rdquo;
              </p>
            )}

            {/* Match & genres — hidden on mobile */}
            <div className="hidden lg:flex items-center gap-3 flex-wrap">
              <span className={`text-sm font-bold ${item.matchPercent >= 90 ? "text-green-400" : "text-yellow-400"}`}>
                {item.matchPercent}% Match
              </span>
              {item.genres.slice(0, 3).map((g) => (
                <span key={g} className="text-xs text-white/50 font-medium">{g}</span>
              ))}
            </div>

            {/* Synopsis — hidden on mobile to save space */}
            <p className="hidden lg:block text-sm lg:text-base text-white/75 leading-relaxed max-w-xl line-clamp-3">
              {item.synopsis}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPlay(item, trailerKey)}
                className="flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-colors shadow-xl"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                <span>Play Trailer</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggle(item)}
                className="flex items-center gap-2 px-4 py-2.5 sm:px-7 sm:py-3 bg-white/15 backdrop-blur-sm text-white font-bold text-sm rounded-lg hover:bg-white/25 transition-colors border border-white/10"
              >
                {inList ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="hidden xs:inline">{inList ? "In My List" : "My List"}</span>
              </motion.button>

              {item.type === "series" && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onMoreInfo(item)}
                  className="flex items-center gap-2 px-4 py-2.5 sm:px-7 sm:py-3 bg-accent-purple text-white font-bold text-sm rounded-lg hover:bg-accent-purple/90 transition-colors shadow-lg shadow-accent-purple/25"
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Episodes</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onMoreInfo(item)}
                className="flex items-center gap-2 px-4 py-2.5 sm:px-7 sm:py-3 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm rounded-lg hover:bg-white/20 transition-colors border border-white/10"
              >
                <Info className="w-4 h-4" />
                <span className="hidden xs:inline">More Info</span>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom-right controls: slide indicators */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-10 z-10 flex items-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? "w-6 bg-white" : "w-2 bg-white/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

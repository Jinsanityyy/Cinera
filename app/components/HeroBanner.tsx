"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Info, Check, Volume2, VolumeX } from "lucide-react";
import { ContentItem } from "@/data/content";
import { useMyList } from "@/app/hooks/useMyList";

interface HeroBannerProps {
  items: ContentItem[];
  onMoreInfo: (item: ContentItem) => void;
}

export default function HeroBanner({ items, onMoreInfo }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const { isInList, toggle } = useMyList();
  const item = items[current] ?? items[0];

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [next]);

  if (!item) return null;

  const inList = isInList(item.id);

  return (
    <section className="relative w-full h-[85vh] min-h-[560px] max-h-[900px] overflow-hidden bg-base">
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
          <div className="absolute inset-0 ken-burns">
            <Image
              src={item.backdropUrl}
              alt={item.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Film grain */}
      <div className="film-grain absolute inset-0 pointer-events-none z-[1]" />

      {/* Vignette */}
      <div className="vignette absolute inset-0 z-[2] pointer-events-none" />

      {/* Bottom scrim */}
      <div className="absolute inset-0 z-[3] hero-scrim pointer-events-none" />

      {/* Left scrim */}
      <div className="absolute inset-0 z-[3] hero-scrim-left pointer-events-none" />

      {/* Top gradient (for nav readability) */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-base/60 to-transparent z-[3] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-16 sm:pb-20 lg:pb-24 px-6 sm:px-10 lg:px-16 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {item.featured && (
                <span className="text-xs font-bold tracking-widest text-accent-purple uppercase">
                  ★ Featured
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/70 bg-white/10 border border-white/10 px-2 py-0.5 rounded">
                {item.maturityRating}
              </span>
              {item.type === "series" && item.seasons && (
                <span className="text-sm text-white/60 font-medium">
                  {item.seasons.length} Season{item.seasons.length !== 1 ? "s" : ""}
                </span>
              )}
              {item.type === "movie" && item.duration && (
                <span className="text-sm text-white/60 font-medium">{item.duration}</span>
              )}
              <span className="text-sm text-white/50">{item.year}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
              {item.title}
            </h1>

            {/* Tagline */}
            {item.tagline && (
              <p className="text-base sm:text-lg text-accent-purple-light font-medium italic tracking-wide">
                &ldquo;{item.tagline}&rdquo;
              </p>
            )}

            {/* Match & genres */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-sm font-bold ${item.matchPercent >= 90 ? "text-green-400" : "text-yellow-400"}`}>
                {item.matchPercent}% Match
              </span>
              {item.genres.slice(0, 3).map((g) => (
                <span key={g} className="text-xs text-white/50 font-medium">
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-xl line-clamp-3">
              {item.synopsis}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-7 py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-colors shadow-xl"
              >
                <Play className="w-5 h-5 fill-black" />
                Play
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggle(item)}
                className="flex items-center gap-2.5 px-7 py-3 bg-white/15 backdrop-blur-sm text-white font-bold text-sm rounded-lg hover:bg-white/25 transition-colors border border-white/10"
              >
                {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {inList ? "In My List" : "My List"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onMoreInfo(item)}
                className="flex items-center gap-2.5 px-7 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold text-sm rounded-lg hover:bg-white/20 transition-colors border border-white/10"
              >
                <Info className="w-4 h-4" />
                More Info
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 right-6 sm:right-10 z-10 flex items-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-0.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Mute toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-6 right-24 sm:right-32 z-10 p-2 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-all"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </section>
  );
}

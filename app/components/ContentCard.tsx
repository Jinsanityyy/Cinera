"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Check, ChevronDown } from "lucide-react";
import { ContentItem } from "@/data/content";
import { useMyList } from "@/app/hooks/useMyList";
import { useTMDB } from "@/app/hooks/useTMDB";

interface ContentCardProps {
  item: ContentItem;
  onSelect: (item: ContentItem) => void;
  onPlay?: (item: ContentItem, trailerKey?: string) => void;
  index?: number;
}

const GRADIENTS = [
  "from-purple-900 via-indigo-950 to-slate-950",
  "from-rose-900 via-red-950 to-slate-950",
  "from-emerald-900 via-teal-950 to-slate-950",
  "from-amber-900 via-orange-950 to-slate-950",
  "from-cyan-900 via-blue-950 to-slate-950",
  "from-violet-900 via-fuchsia-950 to-slate-950",
];

export default function ContentCard({ item, onSelect, onPlay, index = 0 }: ContentCardProps) {
  const [hovered, setHovered] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isInList, toggle } = useMyList();

  // Only enable hover on pointer-capable devices
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  // Intersection observer — defer TMDB fetch until card is visible
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { data: tmdbData, matchPercent: tmdbMatchPercent } = useTMDB(
    item.tmdbId,
    item.tmdbType,
    visible,
    item.title,
    item.year,
  );

  const inList = isInList(item.id);
  const posterSrc = tmdbData?.posterUrl ?? null;
  const trailerKey = tmdbData?.trailerKey ?? item.trailerYouTubeId;
  const fallbackGradient = GRADIENTS[index % GRADIENTS.length];
  const matchPercent = tmdbMatchPercent ?? item.matchPercent;

  const handleHoverStart = () => {
    if (!canHover) return;
    setHovered(true);
    overlayTimer.current = setTimeout(() => setShowOverlay(true), 400);
  };

  const handleHoverEnd = () => {
    if (overlayTimer.current) clearTimeout(overlayTimer.current);
    setHovered(false);
    setShowOverlay(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative flex-shrink-0 w-[42vw] lg:w-[210px] snap-item cursor-pointer group"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      animate={{ scale: hovered ? 1.15 : 1, zIndex: hovered ? 50 : 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ zIndex: hovered ? 50 : 1 }}
      onClick={() => onSelect(item)}
    >
      <div
        className="relative rounded-xl overflow-hidden aspect-[2/3] shadow-lg card-glow bg-surface-2"
        style={hovered ? { boxShadow: "0 20px 60px rgba(0,0,0,0.7)" } : undefined}
      >
        {/* Poster */}
        {posterSrc && !imgError ? (
          <Image
            src={posterSrc}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 42vw, 210px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient}`}>
            {visible && !tmdbData && (
              <div className="absolute inset-0 skeleton opacity-30" />
            )}
            <div className="absolute inset-0 flex items-end p-3">
              <span className="text-white/70 font-bold text-sm leading-tight line-clamp-2">
                {item.title}
              </span>
            </div>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

        {/* Hover overlay — shown after 400ms delay, pointer devices only */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                <p className="text-white font-bold text-xs sm:text-sm leading-tight line-clamp-2">
                  {item.title}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-xs font-bold ${matchPercent >= 90 ? "text-green-400" : "text-yellow-400"}`}>
                    {matchPercent}%
                  </span>
                  <span className="text-[10px] text-white/40 border border-white/20 px-1 rounded">
                    {item.maturityRating}
                  </span>
                  <span className="text-[10px] text-white/50">{item.year}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.genres.slice(0, 2).map((g) => (
                    <span
                      key={g}
                      className="text-[9px] font-medium text-white/50 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pt-0.5">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                    onClick={(e) => { e.stopPropagation(); onPlay?.(item, trailerKey); }}
                    aria-label="Play trailer"
                  >
                    <Play className="w-3.5 h-3.5 fill-black text-black ml-0.5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                    onClick={(e) => { e.stopPropagation(); toggle(item); }}
                    aria-label={inList ? "Remove from list" : "Add to list"}
                  >
                    {inList ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-white" />
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center ml-auto"
                    onClick={(e) => { e.stopPropagation(); onSelect(item); }}
                    aria-label="More info"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-white" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {item.type === "movie" && (
          <div className="absolute top-2 left-2 text-[9px] font-bold tracking-widest text-white/60 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded uppercase">
            Film
          </div>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReelSeries } from "@/data/reels";

interface ReelsRowProps {
  series: ReelSeries[];
  onSelect: (series: ReelSeries, episode?: number) => void;
}

export default function ReelsRow({ series, onSelect }: ReelsRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [rowHovered, setRowHovered] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (!series.length) return null;

  return (
    <section
      className="relative py-2"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      {/* Row header */}
      <div className="flex items-center justify-between px-3 lg:px-16 py-1 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-bold text-[15px] lg:text-lg tracking-tight">Short Dramas</h2>
          <span className="text-[10px] font-bold tracking-widest uppercase bg-accent-purple text-white px-2 py-0.5 rounded-full">
            New
          </span>
        </div>
        <span className="lg:hidden text-accent-purple text-[11px] font-bold tracking-wider uppercase">
          See all
        </span>
        <motion.span
          animate={{ opacity: rowHovered ? 1 : 0, x: rowHovered ? 0 : -4 }}
          className="hidden lg:block text-accent-purple text-xs font-semibold tracking-widest uppercase cursor-pointer hover:text-accent-purple-light transition-colors"
        >
          Explore All →
        </motion.span>
      </div>

      {/* Scroll container */}
      <div className="relative group/row">
        {/* Left arrow */}
        <AnimatePresence>
          {showLeft && rowHovered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("left")}
              className="absolute left-0 top-0 bottom-0 z-20 w-14 lg:w-16 flex items-center justify-center bg-gradient-to-r from-base via-base/80 to-transparent cursor-pointer"
              aria-label="Scroll left"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-scroll px-3 lg:px-16 pb-4 pr-8 lg:pr-0"
          style={{ scrollPaddingLeft: "64px" }}
        >
          {series.map((s, i) => (
            <ReelCard key={s.id} series={s} index={i} onSelect={onSelect} />
          ))}
          {/* End padding */}
          <div className="flex-shrink-0 w-2 lg:w-14" />
        </div>

        {/* Right arrow */}
        <AnimatePresence>
          {showRight && rowHovered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 bottom-0 z-20 w-14 lg:w-16 flex items-center justify-center bg-gradient-to-l from-base via-base/80 to-transparent cursor-pointer"
              aria-label="Scroll right"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Individual reel poster card ───────────────────────────────────────────────
function ReelCard({
  series,
  index,
  onSelect,
}: {
  series: ReelSeries;
  index: number;
  onSelect: (series: ReelSeries, episode?: number) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 snap-start"
      style={{ width: "clamp(120px, 28vw, 160px)" }}
    >
      <motion.button
        className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 group/card focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect(series, 1)}
        aria-label={`Play ${series.title}`}
      >
        {/* Gradient poster */}
        <div className={`absolute inset-0 bg-gradient-to-br ${series.posterGradient}`} />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "150px 150px",
          }}
        />

        {/* Episode count badge — top right */}
        <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-2 py-0.5">
          <span className="text-white text-[10px] font-bold">{series.episodes.length} ep</span>
        </div>

        {/* Genre tag — top left */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${series.accentColor}33`, color: series.accentColor, border: `1px solid ${series.accentColor}44` }}
          >
            {series.genre}
          </span>
        </div>

        {/* Bottom gradient + title */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent pt-8 pb-3 px-2.5">
          <p className="text-white font-black text-xs leading-tight line-clamp-3">
            {series.title}
          </p>
        </div>

        {/* Hover play overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl"
              >
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Title below card */}
      <p className="mt-2 text-white/80 text-xs font-semibold leading-tight line-clamp-2 px-0.5">
        {series.title}
      </p>
    </motion.div>
  );
}

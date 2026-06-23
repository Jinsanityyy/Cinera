"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentItem } from "@/data/content";
import ContentCard from "./ContentCard";

interface ContentRowProps {
  label: string;
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
  onPlay?: (item: ContentItem, trailerKey?: string) => void;
}

export default function ContentRow({ label, items, onSelect, onPlay }: ContentRowProps) {
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
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section
      className="relative py-2"
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      {/* Row header */}
      <div className="flex items-center gap-3 px-3 sm:px-8 lg:px-16 mb-3">
        <h2 className="text-white font-bold text-base sm:text-lg tracking-tight">{label}</h2>
        <motion.span
          animate={{ opacity: rowHovered ? 1 : 0, x: rowHovered ? 0 : -4 }}
          className="text-accent-purple text-xs font-semibold tracking-widest uppercase cursor-pointer hover:text-accent-purple-light transition-colors"
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
              className="absolute left-0 top-0 bottom-0 z-20 w-14 sm:w-16 flex items-center justify-center bg-gradient-to-r from-base via-base/80 to-transparent cursor-pointer"
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
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-scroll px-3 sm:px-8 lg:px-16 pb-4"
          style={{ scrollPaddingLeft: "64px" }}
        >
          {items.map((item, i) => (
            <ContentCard
              key={item.id}
              item={item}
              onSelect={onSelect}
              onPlay={onPlay}
              index={i}
            />
          ))}
          {/* End padding */}
          <div className="flex-shrink-0 w-4 sm:w-8 lg:w-14" />
        </div>

        {/* Right arrow */}
        <AnimatePresence>
          {showRight && rowHovered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 bottom-0 z-20 w-14 sm:w-16 flex items-center justify-center bg-gradient-to-l from-base via-base/80 to-transparent cursor-pointer"
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

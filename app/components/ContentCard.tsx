"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Check, ChevronDown } from "lucide-react";
import { ContentItem } from "@/data/content";
import { useMyList } from "@/app/hooks/useMyList";

interface ContentCardProps {
  item: ContentItem;
  onSelect: (item: ContentItem) => void;
  index?: number;
}

export default function ContentCard({ item, onSelect, index = 0 }: ContentCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { isInList, toggle } = useMyList();
  const inList = isInList(item.id);

  const gradients = [
    "from-purple-900 via-indigo-900 to-slate-900",
    "from-rose-900 via-red-900 to-slate-900",
    "from-emerald-900 via-teal-900 to-slate-900",
    "from-amber-900 via-orange-900 to-slate-900",
    "from-cyan-900 via-blue-900 to-slate-900",
  ];
  const fallbackGradient = gradients[index % gradients.length];

  return (
    <motion.div
      className="relative flex-shrink-0 w-[160px] sm:w-[190px] lg:w-[220px] snap-item cursor-pointer group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.08, zIndex: 50 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ zIndex: hovered ? 50 : 1 }}
      onClick={() => onSelect(item)}
    >
      {/* Card base */}
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] shadow-lg card-glow bg-surface-2">
        {/* Poster image */}
        {!imgError ? (
          <Image
            src={item.posterUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 190px, 220px"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} flex items-end p-3`}>
            <span className="text-white font-bold text-sm leading-tight line-clamp-2">{item.title}</span>
          </div>
        )}

        {/* Gradient overlay always */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Title + info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                <p className="text-white font-bold text-xs sm:text-sm leading-tight line-clamp-2">
                  {item.title}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-xs font-bold ${item.matchPercent >= 90 ? "text-green-400" : "text-yellow-400"}`}>
                    {item.matchPercent}%
                  </span>
                  <span className="text-[10px] text-white/40 border border-white/20 px-1 rounded">
                    {item.maturityRating}
                  </span>
                  <span className="text-[10px] text-white/50">{item.year}</span>
                </div>

                {/* Genre tags */}
                <div className="flex flex-wrap gap-1">
                  {item.genres.slice(0, 2).map((g) => (
                    <span key={g} className="text-[9px] font-medium text-white/50 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                    onClick={(e) => { e.stopPropagation(); }}
                    aria-label="Play"
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

        {/* Type badge */}
        {item.type === "movie" && (
          <div className="absolute top-2 left-2 text-[9px] font-bold tracking-widest text-white/60 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded uppercase">
            Film
          </div>
        )}
      </div>
    </motion.div>
  );
}

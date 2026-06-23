"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ContentItem } from "@/data/content";
import { useTMDB } from "@/app/hooks/useTMDB";

function QuickTile({
  item,
  onClick,
  delay,
}: {
  item: ContentItem;
  onClick: (item: ContentItem) => void;
  delay: number;
}) {
  const { data } = useTMDB(item.tmdbId, item.tmdbType, true);
  const posterSrc = data?.posterUrl ?? null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onClick(item)}
      className="flex items-center overflow-hidden rounded-lg bg-surface-2 active:bg-surface-3 transition-colors text-left w-full h-[52px]"
    >
      <div className="relative flex-shrink-0 w-[52px] h-[52px]">
        {posterSrc ? (
          <Image
            src={posterSrc}
            alt={item.title}
            fill
            className="object-cover"
            sizes="52px"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${item.backdropUrl}`} />
        )}
      </div>
      <span className="flex-1 px-3 text-[11px] font-bold text-white/90 leading-tight line-clamp-2">
        {item.title}
      </span>
    </motion.button>
  );
}

interface QuickGridProps {
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
}

export default function QuickGrid({ items, onSelect }: QuickGridProps) {
  return (
    <section className="px-3 pt-5 pb-1 sm:hidden">
      <h2 className="text-white font-bold text-[15px] tracking-tight mb-3">
        Top Picks
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {items.slice(0, 6).map((item, i) => (
          <QuickTile key={item.id} item={item} onClick={onSelect} delay={i * 0.05} />
        ))}
      </div>
    </section>
  );
}

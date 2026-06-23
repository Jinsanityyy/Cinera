"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import { allContent } from "@/data/content";
import type { ContentItem } from "@/data/content";
import { useTMDB } from "@/app/hooks/useTMDB";

const GENRES = ["Action","Drama","Comedy","Thriller","Sci-Fi","Horror","Mystery","Crime","Fantasy","Anime","History"];
const RECENT_KEY = "cinera-recent-searches";

function ResultCard({ item, onSelect }: { item: ContentItem; onSelect: (i: ContentItem) => void }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { rootMargin: "100px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { data } = useTMDB(item.tmdbId, item.tmdbType, visible);
  const poster = data?.posterUrl ?? null;

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.94 }}
      onClick={() => onSelect(item)}
      className="flex flex-col overflow-hidden rounded-lg text-left"
    >
      <div className="relative aspect-[2/3] w-full bg-surface-2 rounded-lg overflow-hidden">
        {poster ? (
          <Image src={poster} alt={item.title} fill className="object-cover" sizes="120px" />
        ) : visible && !data ? (
          <div className="absolute inset-0 skeleton" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${item.posterUrl}`} />
        )}
      </div>
      <p className="text-white/80 text-[11px] font-semibold line-clamp-2 mt-1.5 px-0.5">{item.title}</p>
    </motion.button>
  );
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) { setQuery(""); setActiveGenres([]); return; }
    try { setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]")); } catch { /* ignore */ }
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [isOpen]);

  const saveRecent = useCallback((q: string) => {
    if (!q.trim()) return;
    const next = [q.trim(), ...recent.filter(s => s !== q.trim())].slice(0, 6);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, [recent]);

  const toggleGenre = (g: string) =>
    setActiveGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const results = allContent.filter(item => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || item.title.toLowerCase().includes(q) || item.genres.some(g => g.toLowerCase().includes(q));
    const matchG = activeGenres.length === 0 || activeGenres.some(g => item.genres.includes(g));
    return matchQ && matchG;
  });

  const handleSelect = (item: ContentItem) => {
    saveRecent(query || item.title);
    window.dispatchEvent(new CustomEvent("cinera:select", { detail: item }));
    onClose();
  };

  const hasFilter = query.trim() || activeGenres.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-base flex flex-col"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          {/* Search bar */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 flex-shrink-0">
            <div className="flex-1 flex items-center gap-3 bg-surface rounded-2xl px-4 h-12">
              <SearchIcon className="w-[18px] h-[18px] text-white/35 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                inputMode="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Escape" && onClose()}
                placeholder="Titles, genres, cast…"
                className="flex-1 bg-transparent text-white placeholder-white/30 text-[16px] outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-white/40 p-1">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button onClick={onClose} className="text-[15px] font-semibold text-white/60 px-1 flex-shrink-0">
              Cancel
            </button>
          </div>

          {/* Genre chips */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide flex-shrink-0">
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                  activeGenres.includes(g)
                    ? "bg-accent-purple border-accent-purple text-white"
                    : "bg-transparent border-white/15 text-white/55"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="h-px bg-white/6 mx-4 flex-shrink-0" />

          {/* Results */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {!hasFilter ? (
              <div className="px-4 pt-5 space-y-6">
                {recent.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/35 mb-3">
                      <Clock className="w-3.5 h-3.5" /> Recent
                    </h3>
                    <div className="space-y-0.5">
                      {recent.map((s, i) => (
                        <button key={i} onClick={() => setQuery(s)}
                          className="w-full text-left px-2 py-2.5 text-white/75 text-[15px] rounded-lg active:bg-surface">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/35 mb-3">
                    <TrendingUp className="w-3.5 h-3.5" /> Trending
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
                    {allContent.slice(0, 15).map(item => (
                      <ResultCard key={item.id} item={item} onSelect={handleSelect} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4 pt-4">
                <p className="text-white/30 text-xs mb-4">{results.length} result{results.length !== 1 ? "s" : ""}</p>
                {results.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
                    {results.map(item => (
                      <ResultCard key={item.id} item={item} onSelect={handleSelect} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <SearchIcon className="w-12 h-12 text-white/10" />
                    <p className="text-white/25 font-semibold">No results for &ldquo;{query}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
            <div style={{ height: "env(safe-area-inset-bottom, 24px)" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Film, Loader2 } from "lucide-react";

interface TrailerPlayerProps {
  videoId: string | null;
  title: string;
  onClose: () => void;
}

export default function TrailerPlayer({ videoId, title, onClose }: TrailerPlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLoaded(false);
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [videoId, onClose]);

  return (
    <AnimatePresence>
      {videoId && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — Official Trailer`}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95 modal-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="relative z-10 w-full max-w-5xl">
            {/* Header */}
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-0.5">
                <p className="text-white font-bold text-base sm:text-lg tracking-tight">{title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-accent-purple">
                    Official Trailer
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] text-white/30">YouTube · Official channel</span>
                </div>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                aria-label="Close trailer"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </motion.div>

            {/* Player frame */}
            <motion.div
              className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              {/* Loading state */}
              <AnimatePresence>
                {!loaded && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-surface-2 gap-4 z-10"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center">
                        <Film className="w-6 h-6 text-white/30" />
                      </div>
                      <Loader2 className="w-14 h-14 absolute inset-0 text-accent-purple animate-spin opacity-60" />
                    </div>
                    <p className="text-white/40 text-sm">Loading trailer…</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* iframe */}
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title={`${title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded(true)}
              />
            </motion.div>

            {/* Footer note */}
            <motion.p
              className="mt-4 text-center text-white/25 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              This is the official trailer only. To watch the full title, use &ldquo;Where to Watch&rdquo; in the details.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

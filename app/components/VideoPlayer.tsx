"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertTriangle, Server, RefreshCw } from "lucide-react";
import { useVideoSources } from "@/app/hooks/useVideoSources";

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = "cinera_last_server";

function saveLastServer(id: string, idx: number) {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
    d[id] = idx;
    localStorage.setItem(LS_KEY, JSON.stringify(d));
  } catch {}
}

function loadLastServer(id: string, max: number): number {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
    const v = d[id];
    return typeof v === "number" && v < max ? v : 0;
  } catch {
    return 0;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "loading" | "ready" | "all-failed";

interface VideoPlayerProps {
  contentId: string | null;
  title: string;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoPlayer({ contentId, title, onClose }: VideoPlayerProps) {
  const { sources, loading: sourcesLoading } = useVideoSources(contentId);

  const [activeIdx, setActiveIdx] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [failMessage, setFailMessage] = useState<string | null>(null);

  // Stable refs — never stale, no lint headaches
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);
  const failedRef = useRef(new Set<number>());
  const resumeTimeRef = useRef(0);
  const contentIdRef = useRef(contentId);
  useEffect(() => { contentIdRef.current = contentId; }, [contentId]);

  const destroyHls = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  // ── Reset state whenever the content changes ──────────────────────────────
  useEffect(() => {
    if (!contentId || !sources.length) return;
    failedRef.current = new Set();
    resumeTimeRef.current = 0;
    setStatus("loading");
    setFailMessage(null);
    setActiveIdx(loadLastServer(contentId, sources.length));
  }, [contentId, sources]);

  // ── Load / switch source ──────────────────────────────────────────────────
  useEffect(() => {
    const source = sources[activeIdx];
    if (!source) return;

    // Embed sources: iframe handles its own loading
    if (source.type === "embed") {
      setStatus("loading");
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    destroyHls();
    setStatus("loading");

    const handleReady = () => {
      setStatus("ready");
      if (resumeTimeRef.current > 0) {
        video.currentTime = resumeTimeRef.current;
        resumeTimeRef.current = 0;
      }
      video.play().catch(() => {});
    };

    const handleFailure = () => {
      failedRef.current.add(activeIdx);

      let next = -1;
      for (let i = 1; i <= sources.length; i++) {
        const candidate = (activeIdx + i) % sources.length;
        if (!failedRef.current.has(candidate)) {
          next = candidate;
          break;
        }
      }

      if (next === -1) {
        setStatus("all-failed");
        setFailMessage("All servers are unavailable. Please try again later.");
        return;
      }

      const msg = `Server ${activeIdx + 1} failed. Switching to Server ${next + 1}…`;
      setFailMessage(msg);
      setTimeout(() => setFailMessage(null), 3500);
      if (contentIdRef.current) saveLastServer(contentIdRef.current, next);
      setActiveIdx(next);
    };

    if (source.type === "hls") {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (!Hls.isSupported()) {
            // Safari supports HLS natively
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
              video.src = source.url;
              video.addEventListener("canplay", handleReady, { once: true });
              video.addEventListener("error", handleFailure, { once: true });
            } else {
              handleFailure();
            }
            return;
          }
          const hls = new Hls({ startLevel: -1, enableWorker: true });
          hlsRef.current = hls;
          hls.loadSource(source.url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, handleReady);
          hls.on(Hls.Events.ERROR, (_e: unknown, data: { fatal: boolean }) => {
            if (data.fatal) handleFailure();
          });
        })
        .catch(handleFailure);
    } else {
      // MP4 — native
      video.src = source.url;
      video.addEventListener("canplay", handleReady, { once: true });
      video.addEventListener("error", handleFailure, { once: true });
    }

    return () => {
      destroyHls();
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("error", handleFailure);
      video.src = "";
    };
  }, [activeIdx, sources, destroyHls]);

  // ── Keyboard trap + body scroll lock ─────────────────────────────────────
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!contentId) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      destroyHls();
    };
  }, [contentId, onClose, destroyHls]);

  // ── Manual server switch (saves resume time) ──────────────────────────────
  const switchTo = useCallback((idx: number) => {
    if (idx === activeIdx) return;
    if (videoRef.current && !videoRef.current.paused) {
      resumeTimeRef.current = videoRef.current.currentTime;
    }
    if (contentIdRef.current) saveLastServer(contentIdRef.current, idx);
    setStatus("loading");
    setFailMessage(null);
    setActiveIdx(idx);
  }, [activeIdx]);

  const retryAll = useCallback(() => {
    failedRef.current = new Set();
    setStatus("loading");
    setFailMessage(null);
    setActiveIdx(0);
  }, []);

  const activeSource = sources[activeIdx];
  const isEmbed = activeSource?.type === "embed";
  const isSourcesLoading = sourcesLoading || !sources.length;

  return (
    <AnimatePresence>
      {contentId && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Watch ${title}`}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="relative z-10 w-full max-w-5xl">
            {/* ── Header ── */}
            <motion.div
              className="flex items-start justify-between mb-3 gap-4"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="min-w-0">
                <p className="text-white font-bold text-base sm:text-lg tracking-tight truncate">
                  {title}
                </p>

                {/* Server switcher */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {isSourcesLoading ? (
                    <div className="flex items-center gap-2 text-white/30 text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading servers…
                    </div>
                  ) : (
                    sources.map((src, i) => (
                      <motion.button
                        key={i}
                        onClick={() => switchTo(i)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={[
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                          i === activeIdx
                            ? "bg-accent-purple text-white shadow-lg shadow-accent-purple/30"
                            : failedRef.current.has(i)
                            ? "bg-red-950/60 border border-red-800/40 text-red-400/50 cursor-pointer hover:bg-red-900/40"
                            : "bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 hover:text-white",
                        ].join(" ")}
                        aria-pressed={i === activeIdx}
                        aria-label={`Switch to ${src.name}`}
                      >
                        <Server className="w-3 h-3 flex-shrink-0" />
                        {src.name}
                        <span className="text-[10px] opacity-50 font-normal uppercase">
                          {src.type}
                        </span>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              <button
                ref={closeRef}
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label="Close player"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </motion.div>

            {/* ── Fail toast ── */}
            <AnimatePresence>
              {failMessage && (
                <motion.div
                  className="mb-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-950/70 border border-orange-700/30 text-orange-300 text-sm"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {failMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Player frame ── */}
            <motion.div
              className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              {/* Loading overlay */}
              <AnimatePresence>
                {(status === "loading" || isSourcesLoading) && status !== "all-failed" && (
                  <motion.div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black gap-3"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
                    <p className="text-white/40 text-sm">
                      {isSourcesLoading
                        ? "Loading sources…"
                        : `Connecting to ${activeSource?.name ?? "server"}…`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* All-failed state */}
              {status === "all-failed" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black gap-4 text-center px-6">
                  <AlertTriangle className="w-12 h-12 text-red-400" />
                  <div className="space-y-1">
                    <p className="text-white font-semibold">All servers unavailable</p>
                    <p className="text-white/40 text-sm">Could not connect to any server.</p>
                  </div>
                  <motion.button
                    onClick={retryAll}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white text-sm rounded-xl hover:bg-white/20 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry all servers
                  </motion.button>
                </div>
              )}

              {/* Embed (iframe) */}
              {!isSourcesLoading && isEmbed && status !== "all-failed" && (
                <iframe
                  key={activeSource?.url}
                  src={activeSource?.url ?? ""}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  onLoad={() => setStatus("ready")}
                />
              )}

              {/* Native / HLS video */}
              {!isSourcesLoading && !isEmbed && status !== "all-failed" && (
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                    status === "ready" ? "opacity-100" : "opacity-0"
                  }`}
                  controls
                  playsInline
                />
              )}
            </motion.div>

            {/* Footer */}
            <motion.div
              className="mt-3 flex items-center justify-center gap-2 text-white/20 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {activeSource && (
                <>
                  <span>{activeSource.name}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="uppercase">{activeSource.type}</span>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

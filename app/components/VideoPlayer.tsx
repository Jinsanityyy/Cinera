"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertTriangle, Server, RefreshCw, ChevronDown, ListVideo } from "lucide-react";
import { useVideoSources } from "@/app/hooks/useVideoSources";
import type { Season } from "@/data/content";

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = "cinera_last_server";

function saveLastServer(id: string, idx: number) {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
    d[id] = idx;
    localStorage.setItem(LS_KEY, JSON.stringify(d));
  } catch {}
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "loading" | "ready" | "all-failed";

interface VideoPlayerProps {
  contentId: string | null;
  title: string;
  season?: number;
  episode?: number;
  seasons?: Season[];
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VideoPlayer({
  contentId,
  title,
  season: initialSeason = 1,
  episode: initialEpisode = 1,
  seasons,
  onClose,
}: VideoPlayerProps) {
  // ── Internal episode/season state ─────────────────────────────────────────
  const [activeSeason, setActiveSeason]   = useState(initialSeason);
  const [activeEpisode, setActiveEpisode] = useState(initialEpisode);
  const [showEpisodes, setShowEpisodes]   = useState(false);

  // Sync when a new title is opened
  useEffect(() => {
    setActiveSeason(initialSeason);
    setActiveEpisode(initialEpisode);
    setShowEpisodes(false);
  }, [contentId, initialSeason, initialEpisode]);

  const { sources, loading: sourcesLoading } = useVideoSources(contentId, activeSeason, activeEpisode);

  // ── Player state ──────────────────────────────────────────────────────────
  const [activeIdx, setActiveIdx]       = useState(0);
  const [status, setStatus]             = useState<Status>("loading");
  const [failMessage, setFailMessage]   = useState<string | null>(null);

  const videoRef     = useRef<HTMLVideoElement>(null);
  const hlsRef       = useRef<{ destroy: () => void } | null>(null);
  const failedRef    = useRef(new Set<number>());
  const resumeRef    = useRef(0);
  const contentIdRef = useRef(contentId);
  useEffect(() => { contentIdRef.current = contentId; }, [contentId]);

  const destroyHls = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  // Reset everything when content OR episode changes
  useEffect(() => {
    failedRef.current = new Set();
    resumeRef.current = 0;
    setStatus("loading");
    setFailMessage(null);
    setActiveIdx(0);
  }, [contentId, activeSeason, activeEpisode]);

  // ── Source loading ────────────────────────────────────────────────────────
  useEffect(() => {
    const source = sources[activeIdx];
    if (!source) return;
    if (source.type === "embed") { setStatus("loading"); return; }

    const video = videoRef.current;
    if (!video) return;
    destroyHls();
    setStatus("loading");

    const handleReady = () => {
      setStatus("ready");
      if (resumeRef.current > 0) { video.currentTime = resumeRef.current; resumeRef.current = 0; }
      video.play().catch(() => {});
    };

    const handleFailure = () => {
      failedRef.current.add(activeIdx);
      let next = -1;
      for (let i = 1; i <= sources.length; i++) {
        const c = (activeIdx + i) % sources.length;
        if (!failedRef.current.has(c)) { next = c; break; }
      }
      if (next === -1) { setStatus("all-failed"); setFailMessage("All servers are unavailable."); return; }
      setFailMessage(`Server ${activeIdx + 1} failed. Switching to Server ${next + 1}…`);
      setTimeout(() => setFailMessage(null), 3500);
      if (contentIdRef.current) saveLastServer(contentIdRef.current, next);
      setActiveIdx(next);
    };

    if (source.type === "hls") {
      import("hls.js").then(({ default: Hls }) => {
        if (!Hls.isSupported()) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source.url;
            video.addEventListener("canplay", handleReady, { once: true });
            video.addEventListener("error", handleFailure, { once: true });
          } else { handleFailure(); }
          return;
        }
        const hls = new Hls({ startLevel: -1, enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(source.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, handleReady);
        hls.on(Hls.Events.ERROR, (_e: unknown, data: { fatal: boolean }) => { if (data.fatal) handleFailure(); });
      }).catch(handleFailure);
    } else {
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

  // ── Keyboard + scroll lock ────────────────────────────────────────────────
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!contentId) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; destroyHls(); };
  }, [contentId, onClose, destroyHls]);

  // ── Manual server switch ──────────────────────────────────────────────────
  const switchTo = useCallback((idx: number) => {
    if (idx === activeIdx) return;
    if (videoRef.current && !videoRef.current.paused) resumeRef.current = videoRef.current.currentTime;
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

  // ── Episode picker helpers ────────────────────────────────────────────────
  const selectEpisode = useCallback((s: number, e: number) => {
    setActiveSeason(s);
    setActiveEpisode(e);
    setShowEpisodes(false);
  }, []);

  const currentSeasonData = seasons?.find((s) => s.number === activeSeason);
  const hasSeasonsData    = !!seasons?.length;

  const activeSource    = sources[activeIdx];
  const isEmbed         = activeSource?.type === "embed";
  const isSourcesLoading = sourcesLoading || !sources.length;
  const episodeLabel    = hasSeasonsData ? ` · S${activeSeason} E${activeEpisode}` : "";

  return (
    <AnimatePresence>
      {contentId && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-6"
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

          {/* Scrollable container so episode list doesn't overflow on small screens */}
          <div className="relative z-10 w-full max-w-5xl max-h-[calc(100dvh-1rem)] overflow-y-auto flex flex-col gap-3">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <motion.div
              className="flex items-start justify-between gap-3 flex-shrink-0"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="min-w-0">
                <p className="text-white font-bold text-sm sm:text-base tracking-tight truncate">
                  {title}{episodeLabel}
                </p>

                {/* Server switcher */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {isSourcesLoading ? (
                    <div className="flex items-center gap-2 text-white/30 text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading…
                    </div>
                  ) : sources.map((src, i) => (
                    <motion.button
                      key={i}
                      onClick={() => switchTo(i)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={[
                        "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                        i === activeIdx
                          ? "bg-accent-purple text-white shadow-lg shadow-accent-purple/30"
                          : failedRef.current.has(i)
                          ? "bg-red-950/60 border border-red-800/40 text-red-400/50"
                          : "bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 hover:text-white",
                      ].join(" ")}
                      aria-pressed={i === activeIdx}
                    >
                      <Server className="w-3 h-3 flex-shrink-0" />
                      {src.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              <button
                ref={closeRef}
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white text-sm hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label="Close player"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Close</span>
              </button>
            </motion.div>

            {/* ── Fail toast ─────────────────────────────────────────────── */}
            <AnimatePresence>
              {failMessage && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-950/70 border border-orange-700/30 text-orange-300 text-sm flex-shrink-0"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {failMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Player frame ────────────────────────────────────────────── */}
            <motion.div
              className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex-shrink-0"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
            >
              {/* Loading */}
              <AnimatePresence>
                {(status === "loading" || isSourcesLoading) && status !== "all-failed" && (
                  <motion.div
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black gap-3"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
                    <p className="text-white/40 text-sm">
                      {isSourcesLoading ? "Loading sources…" : `Connecting to ${activeSource?.name ?? "server"}…`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* All failed */}
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
                    <RefreshCw className="w-4 h-4" /> Retry all servers
                  </motion.button>
                </div>
              )}

              {/* Embed iframe */}
              {!isSourcesLoading && isEmbed && status !== "all-failed" && (
                <iframe
                  key={activeSource?.url}
                  src={activeSource?.url ?? ""}
                  title={`${title}${episodeLabel}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  onLoad={() => setStatus("ready")}
                />
              )}

              {/* Native video */}
              {!isSourcesLoading && !isEmbed && status !== "all-failed" && (
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
                  controls
                  playsInline
                />
              )}
            </motion.div>

            {/* ── Episode / Season picker ──────────────────────────────────── */}
            {hasSeasonsData && (
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Toggle button */}
                <button
                  onClick={() => setShowEpisodes((v) => !v)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white/70 hover:text-white hover:bg-white/12 transition-all text-sm font-medium"
                >
                  <ListVideo className="w-4 h-4 text-accent-purple" />
                  <span>Episodes</span>
                  <span className="text-white/30 text-xs ml-1">S{activeSeason} · E{activeEpisode}</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${showEpisodes ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Picker panel */}
                <AnimatePresence>
                  {showEpisodes && (
                    <motion.div
                      className="mt-2 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="p-3 space-y-3">
                        {/* Season tabs */}
                        {seasons && seasons.length > 1 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {seasons.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => { setActiveSeason(s.number); setActiveEpisode(1); }}
                                className={[
                                  "px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                                  s.number === activeSeason
                                    ? "bg-accent-purple text-white"
                                    : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white",
                                ].join(" ")}
                              >
                                Season {s.number}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Episode grid */}
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 max-h-48 overflow-y-auto">
                          {currentSeasonData?.episodes.map((ep) => {
                            const isActive = ep.episode === activeEpisode && activeSeason === currentSeasonData.number;
                            return (
                              <motion.button
                                key={ep.id}
                                onClick={() => selectEpisode(currentSeasonData.number, ep.episode)}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.93 }}
                                title={ep.title}
                                className={[
                                  "aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                                  isActive
                                    ? "bg-accent-purple text-white shadow-lg shadow-accent-purple/30 ring-2 ring-accent-purple/50"
                                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white",
                                ].join(" ")}
                              >
                                {ep.episode}
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Episode title */}
                        {currentSeasonData && (
                          <p className="text-white/40 text-xs truncate">
                            {currentSeasonData.episodes.find((e) => e.episode === activeEpisode)?.title ?? ""}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 text-white/20 text-xs pb-1 flex-shrink-0">
              {activeSource && (
                <>
                  <span>{activeSource.name}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="uppercase">{activeSource.type}</span>
                </>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

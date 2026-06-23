"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const THRESHOLD = 70;

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const active = useRef(false);
  const isRefreshing = useRef(false);
  const pullYRef = useRef(0);

  const updatePull = (val: number) => {
    setPullY(val);
    pullYRef.current = val;
  };

  const onStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing.current) {
      startY.current = e.touches[0].clientY;
      active.current = true;
    }
  }, []);

  const onMove = useCallback((e: TouchEvent) => {
    if (!active.current) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) updatePull(Math.min(dy * 0.45, THRESHOLD * 1.5));
  }, []);

  const onEnd = useCallback(async () => {
    if (!active.current) return;
    active.current = false;
    const snap = pullYRef.current;
    if (snap >= THRESHOLD && !isRefreshing.current) {
      isRefreshing.current = true;
      setRefreshing(true);
      updatePull(THRESHOLD);
      try { await onRefresh(); } finally {
        isRefreshing.current = false;
        setRefreshing(false);
        updatePull(0);
      }
    } else {
      updatePull(0);
    }
  }, [onRefresh]);

  useEffect(() => {
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [onStart, onMove, onEnd]);

  const height = refreshing ? THRESHOLD : pullY;
  const progress = Math.min(pullY / THRESHOLD, 1);
  const triggered = pullY >= THRESHOLD || refreshing;

  return (
    <>
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ height, transition: pullY === 0 && !refreshing ? "height 0.3s ease" : "none" }}
      >
        <motion.svg
          viewBox="0 0 32 32"
          className="w-8 h-8"
          style={{ opacity: progress }}
          animate={{ rotate: refreshing ? 360 : progress * 180 }}
          transition={refreshing ? { repeat: Infinity, duration: 0.75, ease: "linear" } : { duration: 0.1 }}
        >
          <circle cx="16" cy="16" r="12" stroke="#7b5cf0" strokeWidth="2.5" strokeOpacity="0.2" fill="none" />
          <path
            d="M16 4 A12 12 0 0 1 28 16"
            stroke="#7b5cf0" strokeWidth="2.5" strokeLinecap="round" fill="none"
            style={{ opacity: triggered ? 1 : 0.6 }}
          />
        </motion.svg>
      </div>
      {children}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { VideoSource } from "@/data/content";

const cache = new Map<string, VideoSource[]>();

export function useVideoSources(contentId: string | null) {
  const [sources, setSources] = useState<VideoSource[]>(() =>
    contentId ? (cache.get(contentId) ?? []) : []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contentId) {
      setSources([]);
      return;
    }
    if (cache.has(contentId)) {
      setSources(cache.get(contentId)!);
      return;
    }
    setLoading(true);
    fetch(`/api/sources/${contentId}`)
      .then((r) => r.json())
      .then((d: { sources: VideoSource[] }) => {
        cache.set(contentId, d.sources ?? []);
        setSources(d.sources ?? []);
      })
      .catch(() => setSources([]))
      .finally(() => setLoading(false));
  }, [contentId]);

  return { sources, loading };
}

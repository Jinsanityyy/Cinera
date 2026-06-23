"use client";

import { useState, useEffect } from "react";
import type { VideoSource } from "@/data/content";

const cache = new Map<string, VideoSource[]>();

export function useVideoSources(
  contentId: string | null,
  season = 1,
  episode = 1
) {
  const cacheKey = contentId ? `${contentId}-s${season}e${episode}` : null;

  const [sources, setSources] = useState<VideoSource[]>(() =>
    cacheKey ? (cache.get(cacheKey) ?? []) : []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contentId || !cacheKey) {
      setSources([]);
      return;
    }
    if (cache.has(cacheKey)) {
      setSources(cache.get(cacheKey)!);
      return;
    }
    setLoading(true);
    fetch(`/api/sources/${contentId}?season=${season}&episode=${episode}`)
      .then((r) => r.json())
      .then((d: { sources: VideoSource[] }) => {
        cache.set(cacheKey, d.sources ?? []);
        setSources(d.sources ?? []);
      })
      .catch(() => setSources([]))
      .finally(() => setLoading(false));
  }, [contentId, cacheKey, season, episode]);

  return { sources, loading };
}

"use client";

import { useState, useEffect } from "react";
import type { TMDBRecommendation } from "@/lib/tmdb";

export type { TMDBRecommendation };

const cache = new Map<string, TMDBRecommendation[]>();

export function useTMDBRecommendations(
  tmdbId: number | undefined,
  tmdbType: "movie" | "tv" | undefined,
  enabled = true,
) {
  const [recommendations, setRecommendations] = useState<TMDBRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !tmdbId || !tmdbType) return;
    const cacheKey = `recs-${tmdbId}-${tmdbType}`;
    if (cache.has(cacheKey)) {
      setRecommendations(cache.get(cacheKey)!);
      return;
    }
    setLoading(true);
    fetch(`/api/tmdb/${tmdbId}/recommendations?type=${tmdbType}`)
      .then((r) => r.json())
      .then((d: TMDBRecommendation[]) => {
        const list = Array.isArray(d) ? d : [];
        cache.set(cacheKey, list);
        setRecommendations(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tmdbId, tmdbType, enabled]);

  return { recommendations, loading };
}

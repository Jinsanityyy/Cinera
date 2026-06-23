"use client";

import { useState, useEffect, useRef } from "react";
import type { TMDBData, TMDBSeason, TMDBCastMember } from "@/lib/tmdb";

export type { TMDBData, TMDBSeason, TMDBCastMember };

const cache = new Map<string, TMDBData>();

export function useTMDB(
  tmdbId: number | undefined,
  tmdbType: "movie" | "tv" | undefined,
  enabled = true,
  title?: string,
  year?: number,
) {
  const [data, setData] = useState<TMDBData | null>(() => {
    if (!tmdbId || !tmdbType) return null;
    return cache.get(`${tmdbId}-${tmdbType}`) ?? null;
  });
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !tmdbId || !tmdbType) return;
    const cacheKey = `${tmdbId}-${tmdbType}`;
    if (fetchedRef.current === cacheKey) return;
    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey)!);
      return;
    }
    fetchedRef.current = cacheKey;
    setLoading(true);
    const params = new URLSearchParams({ type: tmdbType });
    if (title) params.set("title", title);
    if (year) params.set("year", String(year));
    fetch(`/api/tmdb/${tmdbId}?${params}`)
      .then((r) => r.json())
      .then((d: TMDBData) => {
        cache.set(cacheKey, d);
        setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tmdbId, tmdbType, enabled, title, year]);

  // Derive match % from real TMDB vote_average, clamped 60–99
  const matchPercent: number | null =
    data?.voteAverage != null
      ? Math.min(99, Math.max(60, Math.round(data.voteAverage * 10)))
      : null;

  return { data, loading, matchPercent };
}

"use client";

import { useState, useEffect, useRef } from "react";
import type { TMDBData } from "@/lib/tmdb";

export type { TMDBData };

const cache = new Map<string, TMDBData>();

export function useTMDB(
  tmdbId: number | undefined,
  tmdbType: "movie" | "tv" | undefined,
  enabled = true
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
    fetch(`/api/tmdb/${tmdbId}?type=${tmdbType}`)
      .then((r) => r.json())
      .then((d: TMDBData) => {
        cache.set(cacheKey, d);
        setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tmdbId, tmdbType, enabled]);

  return { data, loading };
}

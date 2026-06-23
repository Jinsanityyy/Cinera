"use client";

import { useState, useEffect } from "react";

export type TMDBEpisode = {
  number: number;
  title: string;
  synopsis: string;
  runtime: number | null;
  stillUrl: string | null;
};

const cache = new Map<string, TMDBEpisode[]>();

export function useTMDBSeason(tmdbId: number | null, season: number, enabled = true) {
  const cacheKey = tmdbId ? `${tmdbId}-s${season}` : null;

  const [episodes, setEpisodes] = useState<TMDBEpisode[]>(() =>
    cacheKey && cache.has(cacheKey) ? cache.get(cacheKey)! : []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tmdbId || !enabled) return;
    const key = `${tmdbId}-s${season}`;
    if (cache.has(key)) {
      setEpisodes(cache.get(key)!);
      return;
    }
    setLoading(true);
    fetch(`/api/tmdb/${tmdbId}/season/${season}`)
      .then((r) => r.json())
      .then((data) => {
        const eps: TMDBEpisode[] = data.episodes ?? [];
        cache.set(key, eps);
        setEpisodes(eps);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tmdbId, season, enabled]);

  return { episodes, loading };
}

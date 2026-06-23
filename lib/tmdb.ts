const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMG = "https://image.tmdb.org/t/p";

export type TMDBImageData = {
  backdropUrl: string | null;
  posterUrl: string | null;
};

export type WatchProvider = {
  id: number;
  name: string;
  logoUrl: string;
  link: string;
  type: "flatrate" | "rent" | "buy";
};

export type TMDBSeason = {
  number: number;
  name: string;
  episodeCount: number;
  year: number | null;
};

export type TMDBCastMember = {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
};

export type TMDBRecommendation = {
  tmdbId: number;
  title: string;
  tmdbType: "movie" | "tv";
  posterUrl: string | null;
  backdropUrl: string | null;
  year: number | null;
  overview: string;
  voteAverage: number;
};

export type TMDBData = TMDBImageData & {
  trailerKey: string | null;
  providers: WatchProvider[];
  seasons: TMDBSeason[];
  runtime: number | null;
  voteAverage: number | null;
  cast: TMDBCastMember[];
};

function key() {
  return process.env.TMDB_API_KEY ?? "";
}

async function searchByTitle(
  title: string,
  year: number | undefined,
  tmdbType: "movie" | "tv",
): Promise<{ posterPath: string | null; backdropPath: string | null } | null> {
  const yearParam =
    tmdbType === "movie"
      ? year ? `&year=${year}` : ""
      : year ? `&first_air_date_year=${year}` : "";
  const url = `${TMDB_BASE}/search/${tmdbType}?api_key=${key()}&language=en-US&query=${encodeURIComponent(title)}${yearParam}`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    const results: Array<{ title?: string; name?: string; poster_path?: string | null; backdrop_path?: string | null }> =
      data.results ?? [];
    if (!results.length) return null;
    const normalized = title.toLowerCase();
    const match =
      results.find((r) => (r.title ?? r.name ?? "").toLowerCase() === normalized) ??
      results[0];
    return {
      posterPath: match.poster_path ?? null,
      backdropPath: match.backdrop_path ?? null,
    };
  } catch {
    return null;
  }
}

export async function fetchTMDBData(
  tmdbId: number,
  tmdbType: "movie" | "tv",
  opts?: { title?: string; year?: number },
): Promise<TMDBData> {
  const empty: TMDBData = {
    backdropUrl: null,
    posterUrl: null,
    trailerKey: null,
    providers: [],
    seasons: [],
    runtime: null,
    voteAverage: null,
    cast: [],
  };
  if (!key()) return empty;

  const ep = `${TMDB_BASE}/${tmdbType}/${tmdbId}`;
  const qs = `?api_key=${key()}&language=en-US`;

  const [detailsRes, videosRes, providersRes, creditsRes] = await Promise.allSettled([
    fetch(`${ep}${qs}`, { next: { revalidate: 86400 } }),
    fetch(`${ep}/videos${qs}`, { next: { revalidate: 86400 } }),
    fetch(`${ep}/watch/providers${qs}`, { next: { revalidate: 86400 } }),
    fetch(`${ep}/credits${qs}`, { next: { revalidate: 86400 } }),
  ]);

  const parse = async (r: PromiseSettledResult<Response>) =>
    r.status === "fulfilled" && r.value.ok ? r.value.json().catch(() => ({})) : {};

  const [details, videos, watchData, creditsData] = await Promise.all([
    parse(detailsRes),
    parse(videosRes),
    parse(providersRes),
    parse(creditsRes),
  ]);

  let posterPath: string | null = details.poster_path ?? null;
  let backdropPath: string | null = details.backdrop_path ?? null;

  // Fallback: search by title+year when the direct ID returns no poster
  if (!posterPath && opts?.title) {
    const fallback = await searchByTitle(opts.title, opts.year, tmdbType);
    if (fallback?.posterPath) {
      posterPath = fallback.posterPath;
      if (!backdropPath) backdropPath = fallback.backdropPath;
      console.log(`[TMDB] fallback_ok  id=${tmdbId} title="${opts.title}"`);
    } else {
      console.warn(`[TMDB] NO_POSTER    id=${tmdbId} type=${tmdbType} title="${opts.title}" → gradient`);
    }
  } else if (!posterPath) {
    console.warn(`[TMDB] NO_POSTER    id=${tmdbId} type=${tmdbType} → gradient`);
  }

  const backdropUrl = backdropPath ? `${TMDB_IMG}/original${backdropPath}` : null;
  const posterUrl = posterPath ? `${TMDB_IMG}/w500${posterPath}` : null;

  type VideoResult = { type: string; site: string; official?: boolean; key: string };
  const trailers: VideoResult[] = videos.results ?? [];
  const trailer =
    trailers.find((v) => v.type === "Trailer" && v.site === "YouTube" && v.official) ??
    trailers.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
    trailers.find((v) => v.site === "YouTube");
  const trailerKey = trailer?.key ?? null;

  const usData = watchData.results?.US ?? {};
  const providerLink: string = usData.link ?? "";
  const providers: WatchProvider[] = [];
  const seen = new Set<number>();
  type RawProvider = { provider_id: number; provider_name: string; logo_path: string };
  const add = (list: RawProvider[], type: WatchProvider["type"]) =>
    (list ?? []).forEach((p) => {
      if (!seen.has(p.provider_id)) {
        seen.add(p.provider_id);
        providers.push({
          id: p.provider_id,
          name: p.provider_name,
          logoUrl: `${TMDB_IMG}/original${p.logo_path}`,
          link: providerLink,
          type,
        });
      }
    });
  add(usData.flatrate, "flatrate");
  add(usData.rent, "rent");
  add(usData.buy, "buy");

  type RawSeason = { season_number: number; name: string; episode_count: number; air_date: string | null };
  const seasons: TMDBSeason[] =
    tmdbType === "tv"
      ? (details.seasons ?? [])
          .filter((s: RawSeason) => s.season_number > 0)
          .map((s: RawSeason) => ({
            number: s.season_number,
            name: s.name,
            episodeCount: s.episode_count,
            year: s.air_date ? Number(s.air_date.split("-")[0]) : null,
          }))
      : [];

  const runtime: number | null =
    tmdbType === "movie"
      ? (details.runtime ?? null)
      : (details.episode_run_time?.[0] ?? null);

  const voteAverage: number | null =
    typeof details.vote_average === "number" ? details.vote_average : null;

  type RawCast = { id: number; name: string; character: string; profile_path: string | null };
  const cast: TMDBCastMember[] = ((creditsData.cast ?? []) as RawCast[])
    .slice(0, 8)
    .map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profileUrl: c.profile_path ? `${TMDB_IMG}/w185${c.profile_path}` : null,
    }));

  return { backdropUrl, posterUrl, trailerKey, providers, seasons, runtime, voteAverage, cast };
}

export async function fetchTMDBRecommendations(
  tmdbId: number,
  tmdbType: "movie" | "tv",
): Promise<TMDBRecommendation[]> {
  if (!key()) return [];

  const ep = `${TMDB_BASE}/${tmdbType}/${tmdbId}`;
  const qs = `?api_key=${key()}&language=en-US&page=1`;

  const tryFetch = async (url: string) => {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      const data = await res.json();
      return data.results ?? [];
    } catch {
      return [];
    }
  };

  let results = await tryFetch(`${ep}/recommendations${qs}`);
  if (!results.length) results = await tryFetch(`${ep}/similar${qs}`);

  type RawRec = {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    release_date?: string;
    first_air_date?: string;
    overview: string;
    vote_average: number;
  };

  return (results as RawRec[]).slice(0, 12).map((r) => ({
    tmdbId: r.id,
    title: r.title ?? r.name ?? "Unknown",
    tmdbType,
    posterUrl: r.poster_path ? `${TMDB_IMG}/w342${r.poster_path}` : null,
    backdropUrl: r.backdrop_path ? `${TMDB_IMG}/w780${r.backdrop_path}` : null,
    year: r.release_date
      ? Number(r.release_date.split("-")[0])
      : r.first_air_date
        ? Number(r.first_air_date.split("-")[0])
        : null,
    overview: r.overview,
    voteAverage: r.vote_average ?? 0,
  }));
}

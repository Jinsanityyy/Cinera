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

export type TMDBData = TMDBImageData & {
  trailerKey: string | null;
  providers: WatchProvider[];
};

function key() {
  return process.env.TMDB_API_KEY ?? "";
}

export async function fetchTMDBData(
  tmdbId: number,
  tmdbType: "movie" | "tv"
): Promise<TMDBData> {
  if (!key()) {
    return { backdropUrl: null, posterUrl: null, trailerKey: null, providers: [] };
  }

  const ep = `${TMDB_BASE}/${tmdbType}/${tmdbId}`;
  const qs = `?api_key=${key()}&language=en-US`;

  const [detailsRes, videosRes, providersRes] = await Promise.allSettled([
    fetch(`${ep}${qs}`, { next: { revalidate: 86400 } }),
    fetch(`${ep}/videos${qs}`, { next: { revalidate: 86400 } }),
    fetch(`${ep}/watch/providers${qs}`, { next: { revalidate: 86400 } }),
  ]);

  const parse = async (r: PromiseSettledResult<Response>) =>
    r.status === "fulfilled" && r.value.ok ? r.value.json().catch(() => ({})) : {};

  const [details, videos, watchData] = await Promise.all([
    parse(detailsRes),
    parse(videosRes),
    parse(providersRes),
  ]);

  const backdropUrl = details.backdrop_path
    ? `${TMDB_IMG}/original${details.backdrop_path}`
    : null;
  const posterUrl = details.poster_path
    ? `${TMDB_IMG}/w500${details.poster_path}`
    : null;

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

  return { backdropUrl, posterUrl, trailerKey, providers };
}

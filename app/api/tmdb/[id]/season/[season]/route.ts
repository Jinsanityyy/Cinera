import { NextRequest, NextResponse } from "next/server";
import { TMDB_IMG } from "@/lib/tmdb";

type RawEpisode = {
  episode_number: number;
  name: string;
  overview: string;
  runtime: number | null;
  still_path: string | null;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; season: string } }
) {
  const tmdbId = Number(params.id);
  const seasonNum = Number(params.season);

  if (isNaN(tmdbId) || isNaN(seasonNum)) {
    return NextResponse.json({ episodes: [] }, { status: 400 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ episodes: [] });
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNum}?api_key=${apiKey}&language=en-US`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return NextResponse.json({ episodes: [] });

    const data = await res.json();
    const episodes = (data.episodes ?? []).map((ep: RawEpisode) => ({
      number: ep.episode_number,
      title: ep.name,
      synopsis: ep.overview,
      runtime: ep.runtime,
      stillUrl: ep.still_path ? `${TMDB_IMG}/w300${ep.still_path}` : null,
    }));

    return NextResponse.json({ episodes }, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json({ episodes: [] });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { fetchTMDBData } from "@/lib/tmdb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tmdbId = Number(params.id);
  if (isNaN(tmdbId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const tmdbType = (req.nextUrl.searchParams.get("type") as "movie" | "tv") ?? "tv";
  const title = req.nextUrl.searchParams.get("title") ?? undefined;
  const yearRaw = req.nextUrl.searchParams.get("year");
  const year = yearRaw ? Number(yearRaw) : undefined;

  const hasKey = !!process.env.TMDB_API_KEY;
  if (!hasKey) {
    console.warn("[TMDB] TMDB_API_KEY not set");
    return NextResponse.json(
      { backdropUrl: null, posterUrl: null, trailerKey: null, providers: [], seasons: [], runtime: null, voteAverage: null, cast: [] },
      { status: 200 }
    );
  }

  try {
    const data = await fetchTMDBData(tmdbId, tmdbType, { title, year });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
  } catch (err) {
    console.error(`[TMDB] id=${tmdbId} fetch failed:`, err);
    return NextResponse.json(
      { backdropUrl: null, posterUrl: null, trailerKey: null, providers: [], seasons: [], runtime: null, voteAverage: null, cast: [] },
      { status: 200 }
    );
  }
}

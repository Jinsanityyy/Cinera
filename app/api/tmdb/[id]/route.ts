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

  const tmdbType =
    (req.nextUrl.searchParams.get("type") as "movie" | "tv") ?? "tv";

  const hasKey = !!process.env.TMDB_API_KEY;
  console.log(`[TMDB] id=${tmdbId} type=${tmdbType} key_present=${hasKey}`);

  if (!hasKey) {
    console.warn("[TMDB] TMDB_API_KEY is not set — returning empty data");
    return NextResponse.json(
      { backdropUrl: null, posterUrl: null, trailerKey: null, providers: [] },
      { status: 200 }
    );
  }

  try {
    const data = await fetchTMDBData(tmdbId, tmdbType);
    console.log(`[TMDB] id=${tmdbId} backdrop=${data.backdropUrl ? "ok" : "null"} poster=${data.posterUrl ? "ok" : "null"} trailer=${data.trailerKey ?? "null"} providers=${data.providers.length}`);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
  } catch (err) {
    console.error(`[TMDB] id=${tmdbId} fetch failed:`, err);
    return NextResponse.json(
      { backdropUrl: null, posterUrl: null, trailerKey: null, providers: [] },
      { status: 200 }
    );
  }
}

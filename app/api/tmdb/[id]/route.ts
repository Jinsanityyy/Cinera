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

  if (!process.env.TMDB_API_KEY) {
    return NextResponse.json(
      { backdropUrl: null, posterUrl: null, trailerKey: null, providers: [] },
      { status: 200 }
    );
  }

  try {
    const data = await fetchTMDBData(tmdbId, tmdbType);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
    });
  } catch {
    return NextResponse.json(
      { backdropUrl: null, posterUrl: null, trailerKey: null, providers: [] },
      { status: 200 }
    );
  }
}

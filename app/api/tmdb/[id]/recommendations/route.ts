import { NextRequest, NextResponse } from "next/server";
import { fetchTMDBRecommendations } from "@/lib/tmdb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tmdbId = Number(params.id);
  if (isNaN(tmdbId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const tmdbType = (req.nextUrl.searchParams.get("type") as "movie" | "tv") ?? "tv";

  if (!process.env.TMDB_API_KEY) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const recs = await fetchTMDBRecommendations(tmdbId, tmdbType);
    return NextResponse.json(recs, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=900" },
    });
  } catch (err) {
    console.error(`[TMDB] recommendations id=${tmdbId} failed:`, err);
    return NextResponse.json([], { status: 200 });
  }
}

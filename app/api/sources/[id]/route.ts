import { NextRequest, NextResponse } from "next/server";
import { allContent } from "@/data/content";
import type { VideoSource } from "@/data/content";

function buildSources(
  tmdbId: number,
  tmdbType: "movie" | "tv",
  season: number,
  episode: number
): VideoSource[] {
  if (tmdbType === "movie") {
    return [
      { name: "Server 1", url: `https://vidsrc.to/embed/movie/${tmdbId}`,           type: "embed" },
      { name: "Server 2", url: `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,      type: "embed" },
      { name: "Server 3", url: `https://www.2embed.cc/embed/${tmdbId}`,             type: "embed" },
      { name: "Server 4", url: `https://embed.su/embed/movie/${tmdbId}`,            type: "embed" },
    ];
  }
  return [
    { name: "Server 1", url: `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,                       type: "embed" },
    { name: "Server 2", url: `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,   type: "embed" },
    { name: "Server 3", url: `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`,                type: "embed" },
    { name: "Server 4", url: `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,                        type: "embed" },
  ];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const season  = Math.max(1, Number(req.nextUrl.searchParams.get("season")  ?? "1"));
  const episode = Math.max(1, Number(req.nextUrl.searchParams.get("episode") ?? "1"));

  const item = allContent.find((c) => c.id === params.id);
  if (!item) {
    return NextResponse.json({ sources: [] }, { status: 404 });
  }

  const sources = buildSources(item.tmdbId, item.tmdbType, season, episode);
  return NextResponse.json(
    { sources },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
  );
}

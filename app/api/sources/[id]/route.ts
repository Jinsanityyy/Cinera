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
      // ad-light / no-popup providers first
      { name: "Server 1", url: `https://vidlink.pro/movie/${tmdbId}?autoplay=true`,                     type: "embed" },
      { name: "Server 2", url: `https://player.videasy.net/movie/${tmdbId}`,                            type: "embed" },
      { name: "Server 3", url: `https://vidsrc.xyz/embed/movie/${tmdbId}`,                              type: "embed" },
      { name: "Server 4", url: `https://autoembed.cc/movie/${tmdbId}`,                                  type: "embed" },
    ];
  }
  return [
    { name: "Server 1", url: `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?autoplay=true`,     type: "embed" },
    { name: "Server 2", url: `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,            type: "embed" },
    { name: "Server 3", url: `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`,              type: "embed" },
    { name: "Server 4", url: `https://autoembed.cc/tv/${tmdbId}/${season}/${episode}`,                  type: "embed" },
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

import { NextRequest, NextResponse } from "next/server";
import { allContent } from "@/data/content";
import type { VideoSource } from "@/data/content";

// ─── Per-title registry ───────────────────────────────────────────────────────
// Add real CDN/server URLs here keyed by content ID.
// Any title NOT listed here falls back to its YouTube trailer as the embed source.
//
// Example:
// "from-mgm": [
//   { name: "Server 1", url: "https://your-cdn.com/from/s1e1.m3u8", type: "hls" },
//   { name: "Server 2", url: "https://backup.com/from/s1e1.mp4",    type: "mp4"  },
// ],

const registry: Record<string, VideoSource[]> = {};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Use registry entry if available
  if (registry[params.id]) {
    return NextResponse.json(
      { sources: registry[params.id] },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
    );
  }

  // Fall back to the title's own YouTube trailer as embed source
  const item = allContent.find((c) => c.id === params.id);
  const trailerSources: VideoSource[] = item?.trailerYouTubeId
    ? [
        {
          name: "Server 1",
          url: `https://www.youtube.com/embed/${item.trailerYouTubeId}?autoplay=1&rel=0`,
          type: "embed",
        },
      ]
    : [];

  return NextResponse.json(
    { sources: trailerSources },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
  );
}

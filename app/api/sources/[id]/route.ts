import { NextRequest, NextResponse } from "next/server";
import type { VideoSource } from "@/data/content";

// ─── Source registry ─────────────────────────────────────────────────────────
// Add an entry keyed by content ID to override the defaults for a specific title.
// Leave a title out to fall through to the defaults below.
// URLs here are public test streams — replace with your own CDN/server URLs.

const DEFAULTS: VideoSource[] = [
  {
    name: "Server 1",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    type: "hls",
  },
  {
    name: "Server 2",
    url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8",
    type: "hls",
  },
  {
    name: "Server 3",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "mp4",
  },
  {
    name: "Server 4",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    type: "embed",
  },
];

const registry: Record<string, VideoSource[]> = {
  // Example per-title override:
  // "from-mgm": [
  //   { name: "Server 1", url: "https://your-cdn.com/from/s1e1.m3u8", type: "hls" },
  //   { name: "Server 2", url: "https://backup-cdn.com/from/s1e1.mp4",  type: "mp4"  },
  // ],
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sources: VideoSource[] = registry[params.id] ?? DEFAULTS;
  return NextResponse.json(
    { sources },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
  );
}

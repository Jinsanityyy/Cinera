/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // TMDB — real poster and backdrop artwork
      { protocol: "https", hostname: "image.tmdb.org" },
      // Episode thumbnails (placeholder until TMDB episode images wired in)
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;

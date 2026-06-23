import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import RegisterSW from "./components/RegisterSW";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CINERA — Premium Content Discovery",
    template: "%s · CINERA",
  },
  description:
    "Discover the best shows and movies, watch official trailers, and find where to stream them legally. CINERA is your premium content discovery platform.",
  keywords: ["streaming discovery", "where to watch", "movies", "TV shows", "trailers"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CINERA",
  },
  openGraph: {
    title: "CINERA — Premium Content Discovery",
    description:
      "Discover great shows and movies. Watch trailers. Find where to stream legally.",
    siteName: "CINERA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CINERA — Premium Content Discovery",
    description: "Discover great shows and movies. Watch trailers. Find where to stream legally.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* Explicit viewport — forces correct mobile width in TWA/WebView */}
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="HandheldFriendly" content="true" />
      </head>
      <body className={`${inter.variable} bg-base text-text-primary antialiased`}>
        <RegisterSW />
        <Navbar />
        <div className="pb-nav-safe">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}

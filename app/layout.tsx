import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

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
      <body className={`${inter.variable} bg-base text-text-primary antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

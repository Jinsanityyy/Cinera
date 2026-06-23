"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";
import { useProfiles } from "@/app/hooks/useProfiles";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/mylist", label: "My List" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { activeProfile } = useProfiles();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav shadow-xl" : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-[64px] lg:h-[72px]">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative w-9 h-9 lg:w-7 lg:h-7 flex-shrink-0">
              <svg viewBox="0 0 28 28" fill="none" className="w-full h-full drop-shadow-lg">
                <defs>
                  <linearGradient id="cineraGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7b5cf0" />
                    <stop offset="100%" stopColor="#e31c25" />
                  </linearGradient>
                </defs>
                <path d="M14 2L26 14L14 26L2 14Z" fill="url(#cineraGrad)" opacity="0.9" />
                <path d="M11 9.5L20 14L11 18.5V9.5Z" fill="white" fillOpacity="0.95" />
              </svg>
            </div>
            <span className="text-[20px] lg:text-xl font-black tracking-[0.22em] text-white select-none group-hover:text-white/90 transition-colors">
              CINERA
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 ml-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-text-secondary hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {/* Search — large tap target */}
            <Link
              href="/browse"
              className="w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white active:bg-white/10 transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-6 h-6 lg:w-5 lg:h-5" />
            </Link>

            {/* Profile avatar — clearly tappable */}
            <Link href="/profiles" className="w-11 h-11 flex items-center justify-center">
              <div
                className={`w-[42px] h-[42px] lg:w-9 lg:h-9 rounded-xl flex-shrink-0 overflow-hidden ring-2 ring-white/20 text-xl ${
                  activeProfile?.avatarUrl
                    ? ""
                    : activeProfile
                    ? `bg-gradient-to-br ${activeProfile.color} flex items-center justify-center`
                    : "bg-gradient-to-br from-accent-purple to-accent-crimson flex items-center justify-center text-sm font-bold text-white"
                }`}
              >
                {activeProfile?.avatarUrl ? (
                  <Image
                    src={activeProfile.avatarUrl}
                    alt={activeProfile.name}
                    width={42}
                    height={42}
                    className="w-full h-full object-cover"
                  />
                ) : activeProfile ? (
                  activeProfile.emoji
                ) : (
                  "?"
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

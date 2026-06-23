"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useProfiles } from "@/app/hooks/useProfiles";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/mylist", label: "My List" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { activeProfile } = useProfiles();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-nav shadow-xl" : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              {/* Logo mark — refined diamond-play geometry */}
              <div className="relative w-7 h-7 flex-shrink-0">
                <svg viewBox="0 0 28 28" fill="none" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="cineraGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#7b5cf0" />
                      <stop offset="100%" stopColor="#e31c25" />
                    </linearGradient>
                  </defs>
                  {/* Diamond background */}
                  <path d="M14 2L26 14L14 26L2 14Z" fill="url(#cineraGrad)" opacity="0.9" />
                  {/* Play triangle */}
                  <path d="M11 9.5L20 14L11 18.5V9.5Z" fill="white" fillOpacity="0.95" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-[0.22em] text-white select-none group-hover:text-white/90 transition-colors">
                CINERA
              </span>
            </Link>

            {/* Desktop Nav */}
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
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/browse"
                className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              <button
                className="hidden sm:flex p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all duration-200 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-crimson rounded-full" />
              </button>

              <Link href="/profiles" className="flex items-center gap-1.5 group">
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden ${
                  activeProfile?.avatarUrl
                    ? ""
                    : activeProfile
                    ? `bg-gradient-to-br ${activeProfile.color} flex items-center justify-center text-base`
                    : "bg-gradient-to-br from-accent-purple to-accent-crimson flex items-center justify-center text-xs font-bold text-white"
                }`}>
                  {activeProfile?.avatarUrl ? (
                    <Image src={activeProfile.avatarUrl} alt={activeProfile.name} width={32} height={32} className="w-full h-full object-cover" />
                  ) : activeProfile ? (
                    activeProfile.emoji
                  ) : "?"}
                </div>
                <ChevronDown className="hidden sm:block w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
              </Link>

              <button
                className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-base/80 modal-backdrop"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="absolute top-16 left-0 right-0 bg-surface border-b border-border-subtle p-4 flex flex-col gap-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

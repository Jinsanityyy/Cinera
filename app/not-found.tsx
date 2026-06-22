"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-base flex items-center justify-center px-6">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-crimson/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center space-y-8 max-w-lg"
      >
        {/* 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative"
        >
          <div className="text-[10rem] sm:text-[14rem] font-black tracking-tighter leading-none select-none">
            <span className="gradient-text">404</span>
          </div>
          <div className="absolute inset-0 text-[10rem] sm:text-[14rem] font-black tracking-tighter leading-none select-none text-white/5 blur-xl">
            404
          </div>
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Lost in the stream
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            The page you&apos;re looking for has vanished into the void — much like the residents of FROM. Let&apos;s get you back.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/browse"
            className="flex items-center gap-2 px-6 py-3 bg-surface border border-border-subtle text-white font-semibold text-sm rounded-lg hover:bg-surface-2 transition-colors w-full sm:w-auto justify-center"
          >
            <Search className="w-4 h-4" />
            Browse
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

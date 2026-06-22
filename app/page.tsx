"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import HeroBanner from "./components/HeroBanner";
import ContentRow from "./components/ContentRow";
import TitleModal from "./components/TitleModal";
import { allContent, rows } from "@/data/content";
import type { ContentItem } from "@/data/content";

const heroItems: ContentItem[] = [
  allContent.find((c) => c.id === "from-mgm")!,
  allContent.find((c) => c.id === "severance")!,
  allContent.find((c) => c.id === "the-last-of-us")!,
  allContent.find((c) => c.id === "succession")!,
].filter(Boolean);

export default function HomePage() {
  const [selected, setSelected] = useState<ContentItem | null>(null);

  return (
    <main className="min-h-screen bg-base">
      <HeroBanner items={heroItems} onMoreInfo={setSelected} />

      <section className="relative z-10 -mt-16 sm:-mt-24 space-y-6 pb-20">
        {rows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContentRow
              label={row.label}
              items={row.items}
              onSelect={setSelected}
            />
          </motion.div>
        ))}
      </section>

      <footer className="border-t border-border-subtle py-10 px-6 sm:px-10 lg:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">© 2025 STREAMR. All rights reserved.</p>
          <div className="flex items-center gap-6 text-text-muted text-xs">
            {["Terms", "Privacy", "Accessibility", "Help Center"].map((l) => (
              <span key={l} className="hover:text-white/60 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>

      <TitleModal item={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

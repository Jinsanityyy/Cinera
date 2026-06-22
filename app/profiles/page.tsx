"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Check } from "lucide-react";

const profiles = [
  { id: "1", name: "Alex", color: "from-violet-500 to-purple-700", initial: "A", emoji: "🎬" },
  { id: "2", name: "Sam", color: "from-rose-500 to-red-700", initial: "S", emoji: "🍿" },
  { id: "3", name: "Jordan", color: "from-emerald-500 to-teal-700", initial: "J", emoji: "⚡" },
];

export default function ProfilesPage() {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleSelect = (id: string) => {
    if (editing) return;
    setSelected(id);
    setTimeout(() => router.push("/"), 600);
  };

  return (
    <main className="min-h-screen bg-base flex flex-col items-center justify-center py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl space-y-12"
      >
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="text-4xl sm:text-5xl font-black tracking-[0.22em] text-white">
            CINERA
          </div>
          <p className="text-text-muted text-xs tracking-widest uppercase">Content Discovery</p>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {editing ? "Manage Profiles" : "Who's watching?"}
          </h1>
        </div>

        {/* Profile grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {profiles.map((profile, i) => (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={!editing ? { scale: 1.08, y: -4 } : {}}
              whileTap={!editing ? { scale: 0.95 } : {}}
              onClick={() => handleSelect(profile.id)}
              className="flex flex-col items-center gap-3 group"
              aria-label={`Select profile ${profile.name}`}
            >
              <div className="relative">
                {/* Avatar */}
                <div
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-gradient-to-br ${profile.color} flex items-center justify-center text-4xl sm:text-5xl shadow-xl transition-all duration-300 ${
                    selected === profile.id
                      ? "ring-4 ring-white scale-105"
                      : "group-hover:ring-2 group-hover:ring-white/50"
                  }`}
                >
                  {profile.emoji}
                </div>

                {/* Edit badge */}
                <AnimatePresence>
                  {editing && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center"
                    >
                      <Pencil className="w-7 h-7 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected indicator */}
                <AnimatePresence>
                  {selected === profile.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className="text-white/75 font-semibold text-base group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </motion.button>
          ))}

          {/* Add Profile */}
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: profiles.length * 0.08, duration: 0.4 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-3 group"
            aria-label="Add profile"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
              <Plus className="w-10 h-10 text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
            <span className="text-white/40 font-semibold text-base group-hover:text-white/70 transition-colors">
              Add Profile
            </span>
          </motion.button>
        </div>

        {/* Edit/Done button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setEditing(!editing)}
            className={`px-8 py-3 font-bold text-sm tracking-widest uppercase transition-all border rounded-lg ${
              editing
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/50 border-white/20 hover:border-white/50 hover:text-white"
            }`}
          >
            {editing ? "Done" : "Manage Profiles"}
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}

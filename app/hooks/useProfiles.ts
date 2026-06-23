"use client";

import { useState, useEffect } from "react";

export type Profile = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  avatarUrl?: string;
};

const DEFAULT_PROFILES: Profile[] = [
  { id: "1", name: "Alex", color: "from-violet-500 to-purple-700", emoji: "🎬" },
  { id: "2", name: "Sam", color: "from-rose-500 to-red-700", emoji: "🍿" },
  { id: "3", name: "Jordan", color: "from-emerald-500 to-teal-700", emoji: "⚡" },
];

export const PROFILE_COLORS = [
  "from-violet-500 to-purple-700",
  "from-rose-500 to-red-700",
  "from-emerald-500 to-teal-700",
  "from-blue-500 to-indigo-700",
  "from-amber-500 to-orange-700",
  "from-pink-500 to-fuchsia-700",
];

export const PROFILE_EMOJIS = ["🎬", "🍿", "⚡", "🎮", "🎵", "🌟", "🦁", "🐺", "🎭", "🔥", "❄️", "🌙"];

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>(DEFAULT_PROFILES);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cinera_profiles");
      if (stored) setProfiles(JSON.parse(stored));
      const active = localStorage.getItem("cinera_active_profile");
      if (active) setActiveId(active);
    } catch {}
    setLoaded(true);
  }, []);

  const persist = (updated: Profile[]) => {
    setProfiles(updated);
    try { localStorage.setItem("cinera_profiles", JSON.stringify(updated)); } catch {}
  };

  const updateProfile = (id: string, changes: Partial<Omit<Profile, "id">>) => {
    persist(profiles.map(p => (p.id === id ? { ...p, ...changes } : p)));
  };

  const addProfile = (data: Omit<Profile, "id">) => {
    persist([...profiles, { ...data, id: Date.now().toString() }]);
  };

  const deleteProfile = (id: string) => {
    const next = profiles.filter(p => p.id !== id);
    persist(next);
    if (activeId === id) {
      const fallback = next[0]?.id ?? null;
      setActiveId(fallback);
      try {
        if (fallback) localStorage.setItem("cinera_active_profile", fallback);
        else localStorage.removeItem("cinera_active_profile");
      } catch {}
    }
  };

  const selectProfile = (id: string) => {
    setActiveId(id);
    try { localStorage.setItem("cinera_active_profile", id); } catch {}
  };

  const activeProfile = profiles.find(p => p.id === activeId) ?? null;

  return { profiles, activeProfile, activeId, loaded, updateProfile, addProfile, deleteProfile, selectProfile };
}

"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, Check, X, Trash2, Camera } from "lucide-react";
import Image from "next/image";
import { useProfiles, PROFILE_COLORS, PROFILE_EMOJIS, type Profile } from "@/app/hooks/useProfiles";

type EditState = { mode: "edit"; profile: Profile } | { mode: "add" } | null;

function cropAndResizeImage(file: File, size = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("canvas")); return; }
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AvatarPreview({ avatarUrl, emoji, color, size = "w-24 h-24" }: {
  avatarUrl?: string; emoji: string; color: string; size?: string;
}) {
  if (avatarUrl) {
    return (
      <div className={`${size} rounded-xl overflow-hidden flex-shrink-0`}>
        <Image src={avatarUrl} alt="avatar" width={200} height={200} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${size} rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-4xl flex-shrink-0`}>
      {emoji}
    </div>
  );
}

function ProfileFormModal({
  state,
  onSave,
  onDelete,
  onClose,
}: {
  state: EditState;
  onSave: (data: Omit<Profile, "id">) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const isEdit = state?.mode === "edit";
  const initial = isEdit ? state.profile : null;

  const [name, setName] = useState(initial?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? PROFILE_EMOJIS[0]);
  const [color, setColor] = useState(initial?.color ?? PROFILE_COLORS[0]);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initial?.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await cropAndResizeImage(file);
      setAvatarUrl(data);
    } catch {}
    setUploading(false);
    e.target.value = "";
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, emoji, color, avatarUrl });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-sm bg-surface rounded-2xl p-6 space-y-5 border border-border-subtle shadow-2xl"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 style={{ color: "white" }} className="text-lg font-bold">
            {isEdit ? "Edit Profile" : "New Profile"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar preview + upload */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <AvatarPreview avatarUrl={avatarUrl} emoji={emoji} color={color} size="w-24 h-24" />
            {/* Upload overlay */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            >
              <Camera className="w-6 h-6 text-white drop-shadow" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 text-xs font-semibold text-accent-purple-light hover:text-white transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              {uploading ? "Uploading…" : "Upload Photo"}
            </button>
            {avatarUrl && (
              <button
                onClick={() => setAvatarUrl(undefined)}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label style={{ color: "#a1a1aa" }} className="text-xs font-semibold uppercase tracking-wider">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            maxLength={20}
            placeholder="Profile name"
            className="w-full bg-surface-2 border border-border-subtle rounded-lg px-3 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-accent-purple transition-colors"
            style={{ color: "white" }}
            autoFocus
          />
        </div>

        {/* Emoji picker — only shown when no custom photo */}
        {!avatarUrl && (
          <div className="space-y-1.5">
            <label style={{ color: "#a1a1aa" }} className="text-xs font-semibold uppercase tracking-wider">Avatar Emoji</label>
            <div className="flex flex-wrap gap-2">
              {PROFILE_EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${
                    emoji === e ? "bg-accent-purple ring-2 ring-accent-purple-light scale-110" : "bg-surface-2 hover:bg-surface-3"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color picker */}
        <div className="space-y-1.5">
          <label style={{ color: "#a1a1aa" }} className="text-xs font-semibold uppercase tracking-wider">
            {avatarUrl ? "Background Color" : "Color"}
          </label>
          <div className="flex flex-wrap gap-2">
            {PROFILE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c} transition-all ${
                  color === c ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {isEdit && onDelete && (
            <button
              onClick={() => { onDelete(); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white bg-surface-2 hover:bg-surface-3 transition-colors border border-border-subtle"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold bg-accent-purple text-white hover:bg-accent-purple/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEdit ? "Save" : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProfilesPage() {
  const { profiles, activeId, loaded, updateProfile, addProfile, deleteProfile, selectProfile } = useProfiles();
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>(null);
  const router = useRouter();

  const handleSelect = (profile: Profile) => {
    if (editing) {
      setEditState({ mode: "edit", profile });
      return;
    }
    setSelected(profile.id);
    selectProfile(profile.id);
    setTimeout(() => router.push("/"), 600);
  };

  if (!loaded) return null;

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
          <div className="text-4xl sm:text-5xl font-black tracking-[0.22em] text-white">CINERA</div>
          <p className="text-text-muted text-xs tracking-widest uppercase">Content Discovery</p>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {editing ? "Manage Profiles" : "Who's watching?"}
          </h1>
          {editing && (
            <p style={{ color: "#71717a" }} className="text-sm mt-2">Tap a profile to edit it</p>
          )}
        </div>

        {/* Profile grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {profiles.map((profile, i) => (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(profile)}
              className="flex flex-col items-center gap-3 group"
              aria-label={`${editing ? "Edit" : "Select"} profile ${profile.name}`}
            >
              <div className="relative">
                <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-xl shadow-xl transition-all duration-300 ${
                  selected === profile.id
                    ? "ring-4 ring-white scale-105"
                    : activeId === profile.id && !editing
                    ? "ring-2 ring-accent-purple"
                    : "group-hover:ring-2 group-hover:ring-white/50"
                }`}>
                  <AvatarPreview
                    avatarUrl={profile.avatarUrl}
                    emoji={profile.emoji}
                    color={profile.color}
                    size="w-full h-full"
                  />
                </div>

                {/* Edit overlay */}
                <AnimatePresence>
                  {editing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center group-hover:bg-black/65 transition-colors"
                    >
                      <span style={{ color: "white" }} className="text-sm font-bold">Edit</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected checkmark */}
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

              <span
                style={{ color: activeId === profile.id && !editing ? "#a78bfa" : undefined }}
                className="text-white/75 font-semibold text-base group-hover:text-white transition-colors"
              >
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
            onClick={() => setEditState({ mode: "add" })}
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

        {/* Manage / Done */}
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

      {/* Edit / Add modal */}
      <AnimatePresence>
        {editState && (
          <ProfileFormModal
            state={editState}
            onSave={(data) => {
              if (editState.mode === "edit") updateProfile(editState.profile.id, data);
              else addProfile(data);
            }}
            onDelete={editState.mode === "edit" ? () => deleteProfile(editState.profile.id) : undefined}
            onClose={() => setEditState(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

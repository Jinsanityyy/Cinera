"use client";

import { useState, useEffect, useCallback } from "react";
import { ContentItem } from "@/data/content";

const STORAGE_KEY = "streamr_mylist";

export function useMyList() {
  const [list, setList] = useState<ContentItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const toggle = useCallback(
    (item: ContentItem) => {
      setList((prev) => {
        const exists = prev.some((i) => i.id === item.id);
        const next = exists ? prev.filter((i) => i.id !== item.id) : [item, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    []
  );

  const isInList = useCallback(
    (id: string) => list.some((i) => i.id === id),
    [list]
  );

  return { list, toggle, isInList, loaded };
}

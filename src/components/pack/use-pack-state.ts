"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Category, PackList } from "./types";

type SaveQueueEntry = {
  name?: string;
  categories?: Category[];
  excludeConsumables?: boolean;
};

export function usePackState() {
  const [lists, setLists] = useState<PackList[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  const pendingSaves = useRef<Map<string, SaveQueueEntry>>(new Map());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/lists", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const data: { lists: PackList[] } = await res.json();
        if (cancelled) return;
        setLists(data.lists);
        setActiveId(data.lists[0]?.id ?? null);
      } catch {
        if (!cancelled) setError("Could not load your lists.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scheduleSave = useCallback(
    (listId: string, patch: SaveQueueEntry) => {
      const prev = pendingSaves.current.get(listId) ?? {};
      pendingSaves.current.set(listId, { ...prev, ...patch });

      const existing = saveTimers.current.get(listId);
      if (existing) clearTimeout(existing);

      const timer = setTimeout(async () => {
        const body = pendingSaves.current.get(listId);
        pendingSaves.current.delete(listId);
        saveTimers.current.delete(listId);
        if (!body) return;
        try {
          await fetch(`/api/lists/${listId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch {
          /* swallow — UI already updated optimistically */
        }
      }, 400);
      saveTimers.current.set(listId, timer);
    },
    []
  );

  const updateActive = useCallback(
    (mutator: (cats: Category[]) => Category[]) => {
      setLists((prev) => {
        if (!activeId) return prev;
        const next = prev.map((l) => {
          if (l.id !== activeId) return l;
          const newCats = mutator(l.categories);
          scheduleSave(l.id, { categories: newCats });
          return { ...l, categories: newCats };
        });
        return next;
      });
    },
    [activeId, scheduleSave]
  );

  const setActiveExcludeConsumables = useCallback(
    (value: boolean) => {
      if (!activeId) return;
      setLists((prev) =>
        prev.map((l) =>
          l.id === activeId ? { ...l, excludeConsumables: value } : l
        )
      );
      scheduleSave(activeId, { excludeConsumables: value });
    },
    [activeId, scheduleSave]
  );

  const renameList = useCallback(
    (listId: string, name: string) => {
      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, name } : l))
      );
      scheduleSave(listId, { name });
    },
    [scheduleSave]
  );

  const createList = useCallback(async () => {
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Untitled list" }),
      });
      const data: { list: PackList } = await res.json();
      setLists((prev) => [...prev, data.list]);
      setActiveId(data.list.id);
    } catch {
      /* ignore */
    }
  }, []);

  const deleteList = useCallback(
    async (listId: string) => {
      await fetch(`/api/lists/${listId}`, { method: "DELETE" }).catch(
        () => null
      );
      setLists((prev) => {
        const next = prev.filter((l) => l.id !== listId);
        if (activeId === listId) {
          setActiveId(next[0]?.id ?? null);
        }
        return next;
      });
    },
    [activeId]
  );

  return {
    lists,
    activeId,
    setActiveId,
    loading,
    error,
    updateActive,
    setActiveExcludeConsumables,
    renameList,
    createList,
    deleteList,
  };
}

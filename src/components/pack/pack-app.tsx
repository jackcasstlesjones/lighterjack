"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { uid } from "@/lib/weight";
import type { MobileLayout } from "@/lib/mobile-layout";
import type { Category, ItemDraft, ModalState } from "./types";
import { usePackState } from "./use-pack-state";
import { PackHeader } from "./pack-header";
import { PackSummary } from "./pack-summary";
import { PackCategory } from "./pack-category";
import { PackEmptyState } from "./pack-empty-state";
import { PackModals } from "./pack-modals";

type Props = {
  user: { id: string; name: string; email: string };
  mobileItemLayout: MobileLayout;
};

type Drag =
  | { kind: "item"; catId: string; id: string }
  | { kind: "cat"; id: string }
  | null;

export function PackApp({ user, mobileItemLayout }: Props) {
  const router = useRouter();
  const {
    lists,
    activeId,
    setActiveId,
    loading,
    error,
    updateActive,
    createList,
  } = usePackState();

  const [totalUnit, setTotalUnit] = useState<"kg" | "g">("kg");
  const [modal, setModal] = useState<ModalState>(null);
  const dragRef = useRef<Drag>(null);

  const activeList = useMemo(
    () => lists.find((l) => l.id === activeId) ?? null,
    [lists, activeId]
  );
  const categories = activeList?.categories ?? [];

  function openAddItem(catId: string) {
    setModal({
      type: "item",
      catId,
      itemId: null,
      draft: { name: "", desc: "", weight: "", unit: "g", qty: "1" },
    });
  }

  function openEditItem(catId: string, itemId: string) {
    const it = categories
      .find((c) => c.id === catId)
      ?.items.find((x) => x.id === itemId);
    if (!it) return;
    setModal({
      type: "item",
      catId,
      itemId,
      draft: {
        name: it.name,
        desc: it.desc ?? "",
        weight: String(it.weight),
        unit: it.unit,
        qty: String(it.qty),
      },
    });
  }

  function openAddCategory() {
    setModal({ type: "cat", catId: null, draft: { name: "" } });
  }

  function openEditCategory(catId: string) {
    const c = categories.find((x) => x.id === catId);
    if (!c) return;
    setModal({ type: "cat", catId, draft: { name: c.name } });
  }

  function openDeleteItem(catId: string, itemId: string) {
    const it = categories
      .find((c) => c.id === catId)
      ?.items.find((x) => x.id === itemId);
    if (!it) return;
    setModal({ type: "delItem", catId, itemId, name: it.name });
  }

  function openDeleteCategory(catId: string) {
    const c = categories.find((x) => x.id === catId);
    if (!c) return;
    setModal({ type: "delCat", catId, name: c.name, count: c.items.length });
  }

  function closeModal() {
    setModal(null);
  }

  function saveItem(draft: ItemDraft) {
    if (modal?.type !== "item") return;
    const name = draft.name.trim();
    if (!name) return;
    const weight = parseFloat(draft.weight) || 0;
    const qty = Math.max(0, parseInt(draft.qty, 10) || 0);
    const unit: "g" | "kg" = draft.unit === "kg" ? "kg" : "g";
    const desc = draft.desc.trim();
    const { catId, itemId } = modal;

    updateActive((cats) =>
      cats.map((c) => {
        if (c.id !== catId) return c;
        if (itemId) {
          return {
            ...c,
            items: c.items.map((i) =>
              i.id === itemId ? { ...i, name, desc, weight, unit, qty } : i
            ),
          };
        }
        return {
          ...c,
          items: [...c.items, { id: uid("i"), name, desc, weight, unit, qty }],
        };
      })
    );
    closeModal();
  }

  function saveCategory(name: string) {
    if (modal?.type !== "cat") return;
    const catId = modal.catId;
    updateActive((cats) => {
      if (catId) return cats.map((c) => (c.id === catId ? { ...c, name } : c));
      return [...cats, { id: uid("c"), name, items: [] }];
    });
    closeModal();
  }

  function confirmDelete() {
    if (modal?.type === "delItem") {
      const { catId, itemId } = modal;
      updateActive((cats) =>
        cats.map((c) =>
          c.id === catId
            ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
            : c
        )
      );
    } else if (modal?.type === "delCat") {
      const catId = modal.catId;
      updateActive((cats) => cats.filter((c) => c.id !== catId));
    }
    closeModal();
  }

  function toggleItemUnit(catId: string, itemId: string) {
    updateActive((cats) =>
      cats.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          items: c.items.map((it) => {
            if (it.id !== itemId) return it;
            if (it.unit === "g") {
              return {
                ...it,
                unit: "kg" as const,
                weight: Math.round((it.weight / 1000) * 1000) / 1000,
              };
            }
            return {
              ...it,
              unit: "g" as const,
              weight: Math.round(it.weight * 1000),
            };
          }),
        };
      })
    );
  }

  function changeItemQty(catId: string, itemId: string, delta: number) {
    updateActive((cats) =>
      cats.map((c) =>
        c.id !== catId
          ? c
          : {
              ...c,
              items: c.items.map((it) =>
                it.id === itemId
                  ? { ...it, qty: Math.max(0, it.qty + delta) }
                  : it
              ),
            }
      )
    );
  }

  function reorder<T>(arr: T[], from: number, to: number): T[] {
    if (from === to || from < 0 || to < 0) return arr;
    const next = arr.slice();
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    return next;
  }

  function onItemDragStart(catId: string, itemId: string) {
    dragRef.current = { kind: "item", catId, id: itemId };
  }
  function onItemDragEnter(catId: string, itemId: string) {
    const d = dragRef.current;
    if (!d || d.kind !== "item" || d.catId !== catId || d.id === itemId) return;
    updateActive((cats: Category[]) =>
      cats.map((c) => {
        if (c.id !== catId) return c;
        const from = c.items.findIndex((x) => x.id === d.id);
        const to = c.items.findIndex((x) => x.id === itemId);
        return { ...c, items: reorder(c.items, from, to) };
      })
    );
  }

  function onCatDragStart(catId: string) {
    dragRef.current = { kind: "cat", id: catId };
  }
  function onCatDragEnter(catId: string) {
    const d = dragRef.current;
    if (!d || d.kind !== "cat" || d.id === catId) return;
    updateActive((cats) => {
      const from = cats.findIndex((c) => c.id === d.id);
      const to = cats.findIndex((c) => c.id === catId);
      return reorder(cats, from, to);
    });
  }
  function onDragEnd() {
    dragRef.current = null;
  }

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading your lists…
      </div>
    );
  }

  if (error || !activeList) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        {error ?? "No list found."}
      </div>
    );
  }

  const hasCats = categories.length > 0;

  return (
    <div className="min-h-screen">
      <PackHeader
        lists={lists}
        activeId={activeId}
        activeName={activeList.name}
        userName={user.name}
        userEmail={user.email}
        onPickList={setActiveId}
        onNewList={createList}
        onSignOut={handleSignOut}
      />

      <main className="max-w-[980px] mx-auto px-4 pt-[22px] pb-[120px]">
        {hasCats ? (
          <>
            <PackSummary
              categories={categories}
              totalUnit={totalUnit}
              onToggleTotalUnit={() =>
                setTotalUnit((u) => (u === "kg" ? "g" : "kg"))
              }
            />

            {categories.map((c, idx) => (
              <PackCategory
                key={c.id}
                category={c}
                colorIndex={idx}
                mobileItemLayout={mobileItemLayout}
                onAddItem={() => openAddItem(c.id)}
                onEditCategory={() => openEditCategory(c.id)}
                onDeleteCategory={() => openDeleteCategory(c.id)}
                onEditItem={(itemId) => openEditItem(c.id, itemId)}
                onDeleteItem={(itemId) => openDeleteItem(c.id, itemId)}
                onToggleItemUnit={(itemId) => toggleItemUnit(c.id, itemId)}
                onChangeItemQty={(itemId, delta) =>
                  changeItemQty(c.id, itemId, delta)
                }
                onCatDragStart={() => onCatDragStart(c.id)}
                onCatDragEnter={() => onCatDragEnter(c.id)}
                onItemDragStart={(itemId) => onItemDragStart(c.id, itemId)}
                onItemDragEnter={(itemId) => onItemDragEnter(c.id, itemId)}
                onDragEnd={onDragEnd}
              />
            ))}

            <button
              onClick={openAddCategory}
              className="flex items-center justify-center gap-2 w-full py-3.5 border-[1.5px] border-dashed border-[#d2d2cb] rounded-xl text-[#6b6b63] text-[14.5px] font-semibold mt-1.5 hover:border-primary hover:text-secondary-foreground hover:bg-accent-tint transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New category
            </button>
          </>
        ) : (
          <PackEmptyState
            listName={activeList.name}
            onAddCategory={openAddCategory}
          />
        )}
      </main>

      <PackModals
        modal={modal}
        onClose={closeModal}
        onSaveItem={saveItem}
        onSaveCategory={saveCategory}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
}

"use client";

import { GripVertical, Pencil, Trash2, Plus } from "lucide-react";
import { PackItemRow } from "./pack-item-row";
import type { Category } from "./types";
import { categoryGrams, colorFor, trim } from "@/lib/weight";

type Props = {
  category: Category;
  colorIndex: number;
  onAddItem: () => void;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onEditItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleItemUnit: (itemId: string) => void;
  onChangeItemQty: (itemId: string, delta: number) => void;
  onCatDragStart: () => void;
  onCatDragEnter: () => void;
  onItemDragStart: (itemId: string) => void;
  onItemDragEnter: (itemId: string) => void;
  onDragEnd: () => void;
};

export function PackCategory({
  category,
  colorIndex,
  onAddItem,
  onEditCategory,
  onDeleteCategory,
  onEditItem,
  onDeleteItem,
  onToggleItemUnit,
  onChangeItemQty,
  onCatDragStart,
  onCatDragEnter,
  onItemDragStart,
  onItemDragEnter,
  onDragEnd,
}: Props) {
  const totalKg = trim(categoryGrams(category) / 1000);
  const qty = category.items.reduce((a, it) => a + it.qty, 0);
  const empty = category.items.length === 0;

  return (
    <section
      className="bg-card border rounded-2xl mb-4 overflow-hidden shadow-[0_1px_2px_rgba(20,20,15,0.03)]"
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        draggable
        onDragStart={onCatDragStart}
        onDragEnter={onCatDragEnter}
        onDragEnd={onDragEnd}
        onDragOver={(e) => e.preventDefault()}
        className="flex items-center gap-2.5 px-3.5 py-3 bg-[#fafaf8] border-b border-[#eeeeea]"
      >
        <span
          className="flex cursor-grab active:cursor-grabbing text-[#cdcdc6] flex-none"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </span>
        <span
          className="w-[11px] h-[11px] rounded-[3px] flex-none"
          style={{ background: colorFor(colorIndex) }}
        />
        <h2
          className="m-0 flex-1 text-[16.5px] font-bold truncate"
          style={{ letterSpacing: "-0.01em" }}
        >
          {category.name}
        </h2>
        <span className="num text-[#7a7a72] text-[13.5px] font-semibold">
          {totalKg} kg
        </span>
        <span
          className="num text-[#b0b0a8] text-[13px] w-[30px] text-right"
          title="items"
        >
          {qty}
        </span>
        <button
          onClick={onEditCategory}
          title="Edit category"
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#9a9a92] hover:bg-[#efefea] hover:text-[#4b4b44] cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDeleteCategory}
          title="Delete category"
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#9a9a92] hover:bg-[#f8e9e4] hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {category.items.map((item) => (
        <PackItemRow
          key={item.id}
          item={item}
          onToggleUnit={() => onToggleItemUnit(item.id)}
          onIncQty={() => onChangeItemQty(item.id, 1)}
          onDecQty={() => onChangeItemQty(item.id, -1)}
          onEdit={() => onEditItem(item.id)}
          onDelete={() => onDeleteItem(item.id)}
          onDragStart={() => onItemDragStart(item.id)}
          onDragEnter={() => onItemDragEnter(item.id)}
          onDragEnd={onDragEnd}
        />
      ))}

      {empty && (
        <div className="py-[18px] text-center text-[#b0b0a8] text-[13.5px]">
          No items yet.
        </div>
      )}

      <button
        onClick={onAddItem}
        className="flex items-center gap-1.5 w-full px-3.5 py-2.5 text-secondary-foreground text-sm font-semibold text-left hover:bg-accent-tint cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        Add new item
      </button>
    </section>
  );
}

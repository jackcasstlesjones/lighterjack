"use client";

import { GripVertical, Pencil, Trash2, Minus, Plus } from "lucide-react";
import type { Item } from "./types";

type Props = {
  item: Item;
  onToggleUnit: () => void;
  onIncQty: () => void;
  onDecQty: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
};

export function PackItemRow({
  item,
  onToggleUnit,
  onIncQty,
  onDecQty,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: Props) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[#f1f1ec] hover:bg-[#fcfcfa] transition-colors"
    >
      <span
        className="flex text-[#d6d6cf] flex-none cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </span>

      <div className="flex-1 min-w-0">
        <div className="text-[14.5px] font-medium truncate">{item.name}</div>
        {item.desc && (
          <div className="text-[12.5px] text-[#a6a69e] truncate mt-px">
            {item.desc}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-none">
        <span className="num text-sm w-[46px] text-right">{item.weight}</span>
        <button
          onClick={onToggleUnit}
          title="Toggle g / kg"
          className="text-[12px] font-semibold text-primary bg-secondary hover:bg-[#e3eed1] rounded-md px-2 py-1 min-w-[34px] cursor-pointer"
        >
          {item.unit}
        </button>

        <div className="flex items-center bg-muted rounded-md p-0.5">
          <button
            onClick={onDecQty}
            className="w-[26px] h-[26px] rounded-md text-[#7a7a72] text-base leading-none hover:bg-[#e6e6e0] cursor-pointer"
          >
            <Minus className="h-3 w-3 mx-auto" />
          </button>
          <span className="num w-6 text-center text-[13.5px] font-semibold">
            {item.qty}
          </span>
          <button
            onClick={onIncQty}
            className="w-[26px] h-[26px] rounded-md text-[#7a7a72] text-base leading-none hover:bg-[#e6e6e0] cursor-pointer"
          >
            <Plus className="h-3 w-3 mx-auto" />
          </button>
        </div>

        <button
          onClick={onEdit}
          title="Edit item"
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#9a9a92] hover:bg-[#efefea] hover:text-[#4b4b44] cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          title="Delete item"
          className="w-8 h-8 flex items-center justify-center rounded-md text-[#9a9a92] hover:bg-[#f8e9e4] hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

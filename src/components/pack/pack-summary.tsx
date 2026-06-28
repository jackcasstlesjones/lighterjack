"use client";

import { Card } from "@/components/ui/card";
import type { Category } from "./types";
import {
  colorFor,
  effectiveCategoryGrams,
  effectiveListGrams,
  gramsToLbs,
  isCategoryEnabled,
  trim,
} from "@/lib/weight";

type Props = {
  categories: Category[];
  totalUnit: "kg" | "g";
  onToggleTotalUnit: () => void;
  excludeConsumables: boolean;
  onToggleExcludeConsumables: () => void;
};

export function PackSummary({
  categories,
  totalUnit,
  onToggleTotalUnit,
  excludeConsumables,
  onToggleExcludeConsumables,
}: Props) {
  const totalG = effectiveListGrams(categories, excludeConsumables);

  const pcts = categories.map((c) => {
    const g = effectiveCategoryGrams(c, excludeConsumables);
    return totalG ? (g / totalG) * 100 : 0;
  });
  const segments = categories
    .map((_, i) => {
      const pct = pcts[i];
      const cum = pcts.slice(0, i).reduce((a, b) => a + b, 0);
      return {
        color: colorFor(i),
        dash: `${pct} ${100 - pct}`,
        offset: 100 - cum + 25,
        pct,
      };
    })
    .filter((s) => s.pct > 0);

  const totalKg = trim(totalG / 1000);
  const totalLbs = trim(gramsToLbs(totalG));
  const totalDisplay = totalUnit === "kg" ? totalKg : Math.round(totalG);

  return (
    <Card className="p-[22px] mb-[26px] flex gap-[26px] flex-wrap items-center">
      <div className="relative w-[172px] h-[172px] mx-auto flex-none">
        <svg viewBox="0 0 42 42" className="w-[172px] h-[172px]">
          <circle
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke="#eeeeea"
            strokeWidth="5"
          />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={seg.color}
              strokeWidth="5"
              strokeDasharray={seg.dash}
              strokeDashoffset={seg.offset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div
            className="num text-[25px] font-bold leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            {totalKg}
          </div>
          <div className="text-[12px] text-[#9a9a92] font-medium mt-0.5">
            kg total
          </div>
          <div className="num text-[11.5px] text-[#b0b0a8] font-medium mt-0.5">
            {totalLbs} lbs
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-[240px]" style={{ flexBasis: 300 }}>
        <div className="flex items-center px-1 pb-1.5 border-b border-[#eeeeea] text-[12px] font-semibold text-[#a6a69e] uppercase tracking-wide">
          <span className="flex-1">Category</span>
          <span className="w-[90px] text-right">Weight</span>
        </div>

        {categories.map((c, i) => {
          const g = effectiveCategoryGrams(c, excludeConsumables);
          const enabled = isCategoryEnabled(c);
          return (
            <div
              key={c.id}
              className={`flex items-center px-1 py-[7px] text-sm ${
                enabled ? "" : "opacity-40"
              }`}
            >
              <span
                className="w-[11px] h-[11px] rounded-[3px] flex-none mr-2.5"
                style={{ background: colorFor(i) }}
              />
              <span
                className={`flex-1 font-medium truncate ${
                  enabled ? "" : "line-through"
                }`}
              >
                {c.name}
              </span>
              <span className="num w-[62px] text-right text-[#3b3b35]">
                {trim(g / 1000)}
              </span>
              <span className="w-[28px] text-right text-[#a6a69e] text-[12.5px]">
                kg
              </span>
            </div>
          );
        })}

        <div className="flex items-center px-1 pt-2.5 mt-1.5 border-t border-[#eeeeea] text-sm font-bold">
          <span className="flex-1">Total</span>
          <button
            onClick={onToggleTotalUnit}
            className="num text-right cursor-pointer hover:text-secondary-foreground"
          >
            {totalDisplay}
            {totalUnit}
          </button>
          <span className="num text-[#a6a69e] font-medium ml-1.5">
            / {totalLbs} lbs
          </span>
        </div>

        <label className="flex items-center justify-end gap-2.5 px-1 pt-3 mt-1.5 text-[13px] font-medium text-[#4b4b44] cursor-pointer select-none">
          <span>Exclude consumables from totals</span>
          <button
            type="button"
            role="switch"
            aria-checked={excludeConsumables}
            onClick={onToggleExcludeConsumables}
            className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors flex-none ${
              excludeConsumables ? "bg-secondary" : "bg-[#d6d6cf]"
            }`}
          >
            <span
              className={`absolute top-0.5 inline-block w-4 h-4 rounded-full bg-white shadow transition-transform ${
                excludeConsumables ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>
    </Card>
  );
}

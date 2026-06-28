"use client";

import { Card } from "@/components/ui/card";
import type { Category } from "./types";
import { categoryGrams, colorFor, listGrams, trim } from "@/lib/weight";

type Props = {
  categories: Category[];
  totalUnit: "kg" | "g";
  onToggleTotalUnit: () => void;
};

export function PackSummary({ categories, totalUnit, onToggleTotalUnit }: Props) {
  const totalG = listGrams(categories);

  let cum = 0;
  const segments = categories
    .map((c, i) => {
      const g = categoryGrams(c);
      const pct = totalG ? (g / totalG) * 100 : 0;
      const seg = {
        color: colorFor(i),
        dash: `${pct} ${100 - pct}`,
        offset: 100 - cum + 25,
      };
      cum += pct;
      return { ...seg, pct };
    })
    .filter((s) => s.pct > 0);

  const totalKg = trim(totalG / 1000);
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
        </div>
      </div>

      <div className="flex-1 min-w-[240px]" style={{ flexBasis: 300 }}>
        <div className="flex items-center px-1 pb-1.5 border-b border-[#eeeeea] text-[12px] font-semibold text-[#a6a69e] uppercase tracking-wide">
          <span className="flex-1">Category</span>
          <span className="w-[90px] text-right">Weight</span>
        </div>

        {categories.map((c, i) => {
          const g = categoryGrams(c);
          return (
            <div
              key={c.id}
              className="flex items-center px-1 py-[7px] text-sm"
            >
              <span
                className="w-[11px] h-[11px] rounded-[3px] flex-none mr-2.5"
                style={{ background: colorFor(i) }}
              />
              <span className="flex-1 font-medium truncate">{c.name}</span>
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
          <span className="num w-[62px] text-right">{totalDisplay}</span>
          <button
            onClick={onToggleTotalUnit}
            className="w-[30px] text-right text-primary text-[12.5px] font-semibold cursor-pointer hover:underline"
          >
            {totalUnit}
          </button>
        </div>
      </div>
    </Card>
  );
}

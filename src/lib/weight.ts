import type { Category, Item } from "./lists";

export function trim(n: number, decimals = 2): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

export function itemGrams(it: Item): number {
  const g = it.unit === "kg" ? it.weight * 1000 : it.weight;
  return g * it.qty;
}

export function categoryGrams(cat: Category): number {
  return cat.items.reduce((s, it) => s + itemGrams(it), 0);
}

export function listGrams(cats: Category[]): number {
  return cats.reduce((s, c) => s + categoryGrams(c), 0);
}

const PALETTE = [
  "#3b82f6",
  "#ef4444",
  "#eab308",
  "#65a30d",
  "#8b5cf6",
  "#f97316",
  "#0ea5e9",
  "#ec4899",
  "#14b8a6",
  "#a16207",
];

export function colorFor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

export function uid(prefix: string): string {
  return prefix + Math.random().toString(36).slice(2, 10);
}

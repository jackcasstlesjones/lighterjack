export const MOBILE_LAYOUTS = ["compact", "stacked"] as const;
export type MobileLayout = (typeof MOBILE_LAYOUTS)[number];

export const DEFAULT_MOBILE_LAYOUT: MobileLayout = "compact";

export const MOBILE_LAYOUT_LABEL: Record<
  MobileLayout,
  { label: string; description: string }
> = {
  compact: {
    label: "Compact",
    description: "Everything on one row.",
  },
  stacked: {
    label: "Stacked",
    description: "Name on top, actions underneath.",
  },
};

export function normalizeMobileLayout(value: unknown): MobileLayout {
  return MOBILE_LAYOUTS.includes(value as MobileLayout)
    ? (value as MobileLayout)
    : DEFAULT_MOBILE_LAYOUT;
}

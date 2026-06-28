export const ACCENTS = ["green", "yellow", "red", "blue"] as const;
export type AccentColor = (typeof ACCENTS)[number];

export const DEFAULT_ACCENT: AccentColor = "green";

export const ACCENT_SWATCH: Record<AccentColor, { bg: string; label: string }> = {
  green: { bg: "#5d8b1a", label: "Green" },
  yellow: { bg: "#ffc100", label: "Yellow" },
  red: { bg: "#dc2626", label: "Red" },
  blue: { bg: "#2563eb", label: "Blue" },
};

export function normalizeAccent(value: unknown): AccentColor {
  return ACCENTS.includes(value as AccentColor)
    ? (value as AccentColor)
    : DEFAULT_ACCENT;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  ACCENTS,
  ACCENT_SWATCH,
  type AccentColor,
} from "@/lib/accents";

export function SettingsForm({ initialAccent }: { initialAccent: AccentColor }) {
  const router = useRouter();
  const [accent, setAccent] = useState<AccentColor>(initialAccent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function onAccentChange(next: string) {
    const value = next as AccentColor;
    setAccent(value);
    document.body.setAttribute("data-accent", value);
    setStatus("saving");
    try {
      const res = await fetch("/api/profile/accent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accentColor: value }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-1">Appearance</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Pick the colour that drives buttons, highlights, and the brand mark.
      </p>

      <div className="max-w-[260px]">
        <Label htmlFor="accent" className="mb-1.5 block">
          Accent color
        </Label>
        <Select value={accent} onValueChange={onAccentChange}>
          <SelectTrigger id="accent">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACCENTS.map((a) => (
              <SelectItem key={a} value={a}>
                <span className="flex items-center gap-2.5">
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full border border-black/10"
                    style={{ background: ACCENT_SWATCH[a].bg }}
                  />
                  {ACCENT_SWATCH[a].label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2 h-4">
          {status === "saving" && "Saving…"}
          {status === "saved" && "Saved."}
          {status === "error" && (
            <span className="text-destructive">Couldn’t save. Try again.</span>
          )}
        </p>
      </div>
    </Card>
  );
}

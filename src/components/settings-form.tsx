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
import {
  MOBILE_LAYOUTS,
  MOBILE_LAYOUT_LABEL,
  type MobileLayout,
} from "@/lib/mobile-layout";

type Status = "idle" | "saving" | "saved" | "error";

type Props = {
  initialAccent: AccentColor;
  initialMobileLayout: MobileLayout;
};

export function SettingsForm({ initialAccent, initialMobileLayout }: Props) {
  const router = useRouter();
  const [accent, setAccent] = useState<AccentColor>(initialAccent);
  const [accentStatus, setAccentStatus] = useState<Status>("idle");
  const [mobileLayout, setMobileLayout] =
    useState<MobileLayout>(initialMobileLayout);
  const [layoutStatus, setLayoutStatus] = useState<Status>("idle");

  async function onAccentChange(next: string) {
    const value = next as AccentColor;
    setAccent(value);
    document.body.setAttribute("data-accent", value);
    setAccentStatus("saving");
    try {
      const res = await fetch("/api/profile/accent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accentColor: value }),
      });
      if (!res.ok) {
        setAccentStatus("error");
        return;
      }
      setAccentStatus("saved");
      router.refresh();
    } catch {
      setAccentStatus("error");
    }
  }

  async function onMobileLayoutChange(next: string) {
    const value = next as MobileLayout;
    setMobileLayout(value);
    setLayoutStatus("saving");
    try {
      const res = await fetch("/api/profile/mobile-layout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileItemLayout: value }),
      });
      if (!res.ok) {
        setLayoutStatus("error");
        return;
      }
      setLayoutStatus("saved");
      router.refresh();
    } catch {
      setLayoutStatus("error");
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
          {accentStatus === "saving" && "Saving…"}
          {accentStatus === "saved" && "Saved."}
          {accentStatus === "error" && (
            <span className="text-destructive">Couldn’t save. Try again.</span>
          )}
        </p>
      </div>

      <div className="max-w-[260px] mt-5">
        <Label htmlFor="mobile-layout" className="mb-1.5 block">
          Mobile item layout
        </Label>
        <Select value={mobileLayout} onValueChange={onMobileLayoutChange}>
          <SelectTrigger id="mobile-layout">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MOBILE_LAYOUTS.map((l) => (
              <SelectItem key={l} value={l}>
                {MOBILE_LAYOUT_LABEL[l].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2 h-4">
          {layoutStatus === "idle" &&
            MOBILE_LAYOUT_LABEL[mobileLayout].description}
          {layoutStatus === "saving" && "Saving…"}
          {layoutStatus === "saved" && "Saved."}
          {layoutStatus === "error" && (
            <span className="text-destructive">Couldn’t save. Try again.</span>
          )}
        </p>
      </div>
    </Card>
  );
}

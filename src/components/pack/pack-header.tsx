"use client";

import Link from "next/link";
import { Settings, Plus, LogOut, ChevronDown } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { PackList } from "./types";
import { effectiveListGrams, trim } from "@/lib/weight";

type Props = {
  lists: PackList[];
  activeId: string | null;
  activeName: string;
  userName: string;
  userEmail: string;
  onPickList: (id: string) => void;
  onNewList: () => void;
  onSignOut: () => void;
};

export function PackHeader({
  lists,
  activeId,
  activeName,
  userName,
  userEmail,
  onPickList,
  onNewList,
  onSignOut,
}: Props) {
  const initials =
    userName
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || userEmail.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-card/90 backdrop-blur border-b">
      <div className="max-w-[980px] mx-auto px-4 py-2.5 flex items-center gap-2 sm:gap-3">
        <BrandMark size="sm" showWordmark={false} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-1.5 py-1 rounded-md text-[19px] font-bold text-foreground hover:bg-muted cursor-pointer"
              style={{ letterSpacing: "-0.02em" }}
            >
              {activeName || "LighterJack"}
              <ChevronDown className="h-3.5 w-3.5 text-[#9a9a92]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[230px]">
            {lists.map((l) => (
              <DropdownMenuItem
                key={l.id}
                onSelect={() => onPickList(l.id)}
                className="flex items-center justify-between gap-2.5"
              >
                <span className="font-medium">{l.name}</span>
                <span className="num text-[12.5px] text-[#a6a69e]">
                  {trim(
                    effectiveListGrams(l.categories, l.excludeConsumables) /
                      1000
                  )}{" "}
                  kg
                </span>
                {l.id === activeId ? (
                  <span className="sr-only">active</span>
                ) : null}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={onNewList}
              className="text-primary font-semibold gap-2"
            >
              <Plus className="h-3.5 w-3.5" />
              New list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        <Button
          asChild
          variant="ghost"
          size="sm"
          aria-label="Settings"
          className="text-[#5b5b53] gap-1.5 px-2 sm:px-3"
        >
          <Link href="/settings">
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden sm:inline whitespace-nowrap">Settings</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-muted cursor-pointer">
              <div className="w-[27px] h-[27px] rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-[12px]">
                {initials}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#9a9a92]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px]">
            <div className="px-2.5 py-2">
              <div className="text-[13.5px] font-semibold">{userName}</div>
              <div className="text-[12.5px] text-[#a6a69e]">{userEmail}</div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSignOut} className="gap-2">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

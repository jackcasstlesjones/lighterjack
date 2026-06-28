"use client";

import { Backpack, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PackEmptyState({
  listName,
  onAddCategory,
}: {
  listName: string;
  onAddCategory: () => void;
}) {
  return (
    <div className="text-center py-[70px] px-5 animate-in fade-in duration-300">
      <div className="w-[84px] h-[84px] rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-5">
        <Backpack className="h-10 w-10 text-primary" strokeWidth={1.6} />
      </div>
      <h2
        className="m-0 mb-1.5 text-xl font-bold"
        style={{ letterSpacing: "-0.02em" }}
      >
        {listName} is empty
      </h2>
      <p className="m-0 mb-[22px] text-muted-foreground text-[14.5px] max-w-[340px] mx-auto">
        Start by adding a category like “Big 4” or “Cookset”, then load it up
        with gear.
      </p>
      <Button onClick={onAddCategory} size="lg" className="gap-2">
        <Plus className="h-4 w-4" />
        Add first category
      </Button>
    </div>
  );
}

import type { Category, Item } from "@/lib/lists";

export type { Category, Item };

export type PackList = {
  id: string;
  name: string;
  categories: Category[];
  excludeConsumables: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type ModalState =
  | { type: "item"; catId: string; itemId: string | null; draft: ItemDraft }
  | { type: "cat"; catId: string | null; draft: { name: string } }
  | { type: "delItem"; catId: string; itemId: string; name: string }
  | { type: "delCat"; catId: string; name: string; count: number }
  | null;

export type ItemDraft = {
  name: string;
  desc: string;
  weight: string;
  unit: "g" | "kg";
  qty: string;
};

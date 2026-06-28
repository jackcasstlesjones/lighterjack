import { ObjectId, type Collection } from "mongodb";
import { auth } from "./auth";
import { getDb } from "./mongo";
import { headers } from "next/headers";

export type Item = {
  id: string;
  name: string;
  desc: string;
  weight: number;
  unit: "g" | "kg";
  qty: number;
  enabled: boolean;
  consumable: boolean;
};

export type Category = {
  id: string;
  name: string;
  enabled: boolean;
  items: Item[];
};

export type ListDoc = {
  _id?: ObjectId;
  userId: string;
  name: string;
  categories: Category[];
  excludeConsumables: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ListResponse = Omit<ListDoc, "_id" | "userId"> & { id: string };

export async function getCollection(): Promise<Collection<ListDoc>> {
  const db = await getDb();
  return db.collection<ListDoc>("packLists");
}

export async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Response("Unauthorized", { status: 401 });
  return session.user.id;
}

export function toResponse(doc: ListDoc): ListResponse {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    categories: doc.categories,
    excludeConsumables: doc.excludeConsumables ?? false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function uid(prefix: string): string {
  return prefix + Math.random().toString(36).slice(2, 10);
}

export function sanitizeCategories(input: unknown): Category[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((c) => {
      if (!c || typeof c !== "object") return null;
      const cat = c as Record<string, unknown>;
      const items = Array.isArray(cat.items)
        ? cat.items
            .map((it) => {
              if (!it || typeof it !== "object") return null;
              const i = it as Record<string, unknown>;
              const unit = i.unit === "kg" ? "kg" : "g";
              const weight = Number(i.weight);
              const qty = Number(i.qty);
              return {
                id: typeof i.id === "string" ? i.id : uid("i"),
                name: typeof i.name === "string" ? i.name : "",
                desc: typeof i.desc === "string" ? i.desc : "",
                weight: Number.isFinite(weight) ? weight : 0,
                unit: unit as "g" | "kg",
                qty: Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 1,
                enabled: typeof i.enabled === "boolean" ? i.enabled : true,
                consumable:
                  typeof i.consumable === "boolean" ? i.consumable : false,
              } as Item;
            })
            .filter((x): x is Item => x !== null)
        : [];
      return {
        id: typeof cat.id === "string" ? cat.id : uid("c"),
        name: typeof cat.name === "string" ? cat.name : "Untitled",
        enabled: typeof cat.enabled === "boolean" ? cat.enabled : true,
        items,
      } as Category;
    })
    .filter((x): x is Category => x !== null);
}

export function starterCategories(): Category[] {
  return [
    {
      id: uid("c"),
      name: "Big 4",
      enabled: true,
      items: [
        { id: uid("i"), name: "Tent", desc: "", weight: 1200, unit: "g", qty: 1, enabled: true, consumable: false },
        { id: uid("i"), name: "Sleeping pad", desc: "", weight: 480, unit: "g", qty: 1, enabled: true, consumable: false },
        { id: uid("i"), name: "Quilt", desc: "", weight: 600, unit: "g", qty: 1, enabled: true, consumable: false },
        { id: uid("i"), name: "Pack", desc: "", weight: 900, unit: "g", qty: 1, enabled: true, consumable: false },
      ],
    },
    { id: uid("c"), name: "Clothes", enabled: true, items: [] },
    { id: uid("c"), name: "Cookset", enabled: true, items: [] },
  ];
}

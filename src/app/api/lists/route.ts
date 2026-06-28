import { NextRequest, NextResponse } from "next/server";
import {
  getCollection,
  requireUserId,
  toResponse,
  starterCategories,
} from "@/lib/lists";

export async function GET() {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (res) {
    return res as Response;
  }

  const col = await getCollection();
  let lists = await col.find({ userId }).sort({ createdAt: 1 }).toArray();

  if (lists.length === 0) {
    const now = new Date();
    const seed = {
      userId,
      name: "My pack",
      categories: starterCategories(),
      createdAt: now,
      updatedAt: now,
    };
    const result = await col.insertOne(seed);
    lists = [{ ...seed, _id: result.insertedId }];
  }

  return NextResponse.json({ lists: lists.map(toResponse) });
}

export async function POST(req: NextRequest) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (res) {
    return res as Response;
  }

  const body = (await req.json().catch(() => ({}))) as { name?: string };
  const name = (body.name || "Untitled list").trim() || "Untitled list";

  const col = await getCollection();
  const now = new Date();
  const doc = {
    userId,
    name,
    categories: [],
    createdAt: now,
    updatedAt: now,
  };
  const result = await col.insertOne(doc);
  return NextResponse.json({ list: toResponse({ ...doc, _id: result.insertedId }) });
}

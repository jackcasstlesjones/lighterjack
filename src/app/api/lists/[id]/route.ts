import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import {
  getCollection,
  requireUserId,
  sanitizeCategories,
  toResponse,
} from "@/lib/lists";

type Params = { params: Promise<{ id: string }> };

function parseId(id: string): ObjectId | null {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (res) {
    return res as Response;
  }

  const { id } = await params;
  const _id = parseId(id);
  if (!_id) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    categories?: unknown;
  };

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body.name === "string") {
    const n = body.name.trim();
    if (n) update.name = n;
  }
  if (body.categories !== undefined) {
    update.categories = sanitizeCategories(body.categories);
  }

  const col = await getCollection();
  const result = await col.findOneAndUpdate(
    { _id, userId },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ list: toResponse(result) });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch (res) {
    return res as Response;
  }

  const { id } = await params;
  const _id = parseId(id);
  if (!_id) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const col = await getCollection();
  await col.deleteOne({ _id, userId });
  return NextResponse.json({ ok: true });
}

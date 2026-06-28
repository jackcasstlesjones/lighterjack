import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { setUserAccent } from "@/lib/user-prefs";
import { normalizeAccent } from "@/lib/accents";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    accentColor?: string;
  };
  const accent = normalizeAccent(body.accentColor);
  await setUserAccent(session.user.id, accent);

  return NextResponse.json({ accentColor: accent });
}

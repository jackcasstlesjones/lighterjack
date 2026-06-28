import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { setUserMobileLayout } from "@/lib/user-prefs";
import { normalizeMobileLayout } from "@/lib/mobile-layout";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    mobileItemLayout?: string;
  };
  const layout = normalizeMobileLayout(body.mobileItemLayout);
  await setUserMobileLayout(session.user.id, layout);

  return NextResponse.json({ mobileItemLayout: layout });
}

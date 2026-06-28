import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserPrefs } from "@/lib/user-prefs";
import { PackApp } from "@/components/pack/pack-app";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const prefs = await getUserPrefs(session.user.id);

  return (
    <PackApp
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }}
      mobileItemLayout={prefs.mobileItemLayout}
    />
  );
}

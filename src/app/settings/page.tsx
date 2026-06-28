import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserPrefs } from "@/lib/user-prefs";
import { SettingsForm } from "@/components/settings-form";
import { DangerZone } from "@/components/danger-zone";
import { BrandMark } from "@/components/brand-mark";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const prefs = await getUserPrefs(session.user.id);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-card/90 backdrop-blur border-b">
        <div className="max-w-[640px] mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[#5b5b53] hover:text-foreground px-2 py-1 rounded-md hover:bg-muted cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex-1" />
          <BrandMark size="sm" showWordmark={false} />
        </div>
      </header>

      <main className="max-w-[640px] mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ letterSpacing: "-0.02em" }}
        >
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Signed in as {session.user.email}
        </p>

        <SettingsForm
          initialAccent={prefs.accentColor}
          initialMobileLayout={prefs.mobileItemLayout}
        />
        <DangerZone email={session.user.email} />
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { auth } from "@/lib/auth";
import { DEFAULT_ACCENT, getUserAccent } from "@/lib/user-prefs";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LighterJack — track every gram of your kit",
  description:
    "Track the weight of your backpacking gear, build pack lists, and shave grams.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const accent = session?.user?.id
    ? await getUserAccent(session.user.id)
    : DEFAULT_ACCENT;

  return (
    <html lang="en" className={`${hanken.variable} antialiased`}>
      <body className="min-h-screen" data-accent={accent}>
        {children}
      </body>
    </html>
  );
}

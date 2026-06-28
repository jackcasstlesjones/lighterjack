import { getDb } from "./mongo";
import { DEFAULT_ACCENT, normalizeAccent, type AccentColor } from "./accents";
import {
  DEFAULT_MOBILE_LAYOUT,
  normalizeMobileLayout,
  type MobileLayout,
} from "./mobile-layout";

type UserPrefsDoc = {
  userId: string;
  accentColor?: AccentColor;
  mobileItemLayout?: MobileLayout;
  updatedAt: Date;
};

export type UserPrefs = {
  accentColor: AccentColor;
  mobileItemLayout: MobileLayout;
};

async function collection() {
  const db = await getDb();
  return db.collection<UserPrefsDoc>("userPrefs");
}

export async function getUserPrefs(userId: string): Promise<UserPrefs> {
  const col = await collection();
  const doc = await col.findOne({ userId });
  return {
    accentColor: normalizeAccent(doc?.accentColor),
    mobileItemLayout: normalizeMobileLayout(doc?.mobileItemLayout),
  };
}

export async function getUserAccent(userId: string): Promise<AccentColor> {
  return (await getUserPrefs(userId)).accentColor;
}

export async function setUserAccent(
  userId: string,
  accent: AccentColor
): Promise<void> {
  const col = await collection();
  await col.updateOne(
    { userId },
    {
      $set: { accentColor: accent, updatedAt: new Date() },
      $setOnInsert: { userId },
    },
    { upsert: true }
  );
}

export async function setUserMobileLayout(
  userId: string,
  layout: MobileLayout
): Promise<void> {
  const col = await collection();
  await col.updateOne(
    { userId },
    {
      $set: { mobileItemLayout: layout, updatedAt: new Date() },
      $setOnInsert: { userId },
    },
    { upsert: true }
  );
}

export { DEFAULT_ACCENT, DEFAULT_MOBILE_LAYOUT };

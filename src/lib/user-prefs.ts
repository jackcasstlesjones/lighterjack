import { getDb } from "./mongo";
import { DEFAULT_ACCENT, normalizeAccent, type AccentColor } from "./accents";

type UserPrefsDoc = {
  userId: string;
  accentColor: AccentColor;
  updatedAt: Date;
};

async function collection() {
  const db = await getDb();
  return db.collection<UserPrefsDoc>("userPrefs");
}

export async function getUserAccent(userId: string): Promise<AccentColor> {
  const col = await collection();
  const doc = await col.findOne({ userId });
  return normalizeAccent(doc?.accentColor);
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

export { DEFAULT_ACCENT };

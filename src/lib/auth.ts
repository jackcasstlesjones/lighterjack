import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client, getDb } from "./mongo";

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        const userDb = await getDb();
        await Promise.all([
          userDb.collection("packLists").deleteMany({ userId: user.id }),
          userDb.collection("userPrefs").deleteMany({ userId: user.id }),
        ]);
      },
    },
  },
});

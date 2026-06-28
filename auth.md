Let me grab the canonical Better Auth docs to make sure the adapter API is current.The easiest path is Better Auth's built-in MongoDB adapter — no schema generation or migration needed since collections are created automatically. For MongoDB, you don't need to generate or migrate the schema. Here's the minimal setup.

**Install**

```bash
pnpm add better-auth mongodb
```

**`lib/auth.ts`** (server)

```ts
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client, // pass the client so DB transactions are enabled
  }),
  emailAndPassword: { enabled: true },
  // socialProviders: { github: { clientId, clientSecret } }, // optional
});
```

Passing `client` matters: if you don't provide a client, database transactions won't be enabled.

**`app/api/auth/[...all]/route.ts`**

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**`lib/auth-client.ts`** (client)

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
export const { signIn, signUp, signOut, useSession } = authClient;
```

Then `signUp.email({ email, password, name })`, `signIn.email({...})`, `signIn.social({ provider: "github" })`, and `useSession()` in components.

A couple of things worth flagging for your stack:

The connection caveat — in App Router / serverless you don't want a fresh `MongoClient` per HMR reload or invocation. Use the standard global-singleton pattern (the Vercel `with-mongodb` approach) so you reuse one connected client. Several Better Auth users hit duplicate-connection issues otherwise and solved it exactly this way.

The official MongoDB adapter page also references a separate `@better-auth/mongo-adapter` package, but the widely-used and well-attested import is the built-in `better-auth/adapters/mongodb` shown above — that ships with core, so start there unless you hit a reason not to.

If you're using Mongoose elsewhere and want one connection, you can pull the raw client out: `mongooseInstance.connection.getClient()` and pass `.db()` to the adapter, rather than opening a second connection.

Want me to wire in the global-singleton client file, or add social/OAuth providers and session-on-server prefetch for SSR?

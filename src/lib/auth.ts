import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://project-98lnv.vercel.app",
  trustedOrigins: [
    "http://localhost:3000",
    "https://project-98lnv.vercel.app"
  ],
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification
    }
  }),
  emailAndPassword: {
    enabled: true,
  },
});

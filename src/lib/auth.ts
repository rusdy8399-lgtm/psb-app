import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

const getBaseURL = () => {
  if (process.env.NODE_ENV === "production") return "https://project-98lnv.vercel.app";
  return "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: getBaseURL(),
  trustedOrigins: [
    "http://localhost:3000",
    "https://project-98lnv.vercel.app"
  ],
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
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

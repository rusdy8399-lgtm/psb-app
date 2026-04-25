import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { cache } from 'react';

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

// Simple validation to prevent build crash if ENV is missing
if (!url && process.env.NODE_ENV === "production") {
  console.warn("⚠️ DATABASE_URL is not defined. Database features will fail.");
}

const client = createClient({
  url: url || "file:./local.db",
  authToken: authToken,
});

export const db = drizzle(client, { schema });

// Cached query to avoid redundant DB calls per request
export const getSettings = cache(async () => {
  try {
    return await db.query.pengaturanWeb.findFirst();
  } catch (error) {
    console.error("❌ Failed to fetch site settings:", error);
    return null;
  }
});

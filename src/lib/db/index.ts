import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

import { cache } from 'react';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

// Cached query to avoid redundant DB calls per request
export const getSettings = cache(async () => {
  return await db.query.pengaturanWeb.findFirst();
});

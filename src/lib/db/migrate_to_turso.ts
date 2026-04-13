import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function migrate() {
  console.log("🚀 Starting Robust Migration: local.db -> Turso Cloud");

  const localClient = createClient({ url: "file:./local.db" });
  const localDb = drizzle(localClient, { schema });

  const tursoClient = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  });
  const tursoDb = drizzle(tursoClient, { schema });

  const tables = [
    { name: "user", table: schema.user },
    { name: "account", table: schema.account },
    { name: "session", table: schema.session },
    { name: "verification", table: schema.verification },
    { name: "pendaftar", table: schema.pendaftar },
    { name: "ortuWakil", table: schema.ortuWakil },
    { name: "berkasDokumen", table: schema.berkasDokumen },
    { name: "kegiatan", table: schema.kegiatan },
    { name: "fasilitas", table: schema.fasilitas },
    { name: "pengaturanWeb", table: schema.pengaturanWeb },
    { name: "heroSection", table: schema.heroSection },
  ];

  for (const { name, table } of tables) {
    try {
      console.log(`📦 Table: ${name}...`);
      const data = await localDb.select().from(table as any);
      
      if (data.length > 0) {
        let successCount = 0;
        let skipCount = 0;

        for (const row of data) {
          try {
            // One-by-one insert to pinpoint errors and bypass bulk limitations
            await tursoDb.insert(table as any).values(row).onConflictDoNothing();
            successCount++;
          } catch (rowErr: any) {
            console.error(`  ⚠️ Row failed in ${name}:`, rowErr.message);
            skipCount++;
          }
        }
        console.log(`✅ ${name}: ${successCount} synced, ${skipCount} skipped.`);
      } else {
        console.log(`ℹ️ ${name} is empty.`);
      }
    } catch (error: any) {
      console.error(`❌ Global error for ${name}:`, error.message);
    }
  }

  console.log("\n✨ Robust Migration Completed!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("🔥 Critical Failure:", err);
  process.exit(1);
});

import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  console.log("Checking user table...");
  const users = await db.execute("SELECT * FROM user");
  console.log(users.rows);

  console.log("Checking account table...");
  const accounts = await db.execute("SELECT * FROM account");
  console.log(accounts.rows);
}

main().catch(console.error);

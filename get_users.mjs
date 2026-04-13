import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function check() {
  try {
    const users = await client.execute("SELECT * FROM user");
    console.log("USERS:", users.rows);
  } catch (e) {
    console.error(e);
  }
}
check();

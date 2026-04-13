import { db } from "./src/lib/db/index.js";
import { pengaturanWeb } from "./src/lib/db/schema.js";

async function test() {
  const start = Date.now();
  console.log("Fetching settings...");
  try {
    const settings = await db.query.pengaturanWeb.findFirst();
    console.log("Settings fetched in", Date.now() - start, "ms");
    console.log("Data:", settings);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();

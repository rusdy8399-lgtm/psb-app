import { db } from "./src/lib/db";
import { user } from "./src/lib/db/schema";

async function findAdmin() {
    const admin = await db.select().from(user).execute();
    console.log("Found users:", JSON.stringify(admin, null, 2));
}

findAdmin();

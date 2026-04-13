
import { createClient } from '@libsql/client';
const client = createClient({ url: 'file:./local.db' });
async function check() {
  try {
    const res = await client.execute("PRAGMA table_info(pendaftar)");
    console.log("COLUMNS IN pendaftar:");
    res.rows.forEach(row => console.log(`- ${row.name} (${row.type})`));
  } catch (e) {
    console.error("Error checking table:", e);
  }
}
check();

/**
 * Migration Script: Firebase Storage -> Cloudflare R2
 * 
 * Features:
 * - Safe copy: NEVER deletes source files in Firebase Storage.
 * - Dry run support: Pass --dry-run to preview actions without modifying storage or database.
 * - Resilient: Individual file failures do not abort the migration; DB only updates on successful upload.
 * - Full logging: Detailed output and summary report upon completion.
 * 
 * Usage:
 *   Dry-run mode (Preview only):
 *     node --env-file=.env.local scripts/migrate_firebase_to_r2.ts --dry-run
 * 
 *   Execute migration:
 *     node --env-file=.env.local scripts/migrate_firebase_to_r2.ts
 */

import { createClient } from "@libsql/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

interface TableFieldMapping {
  table: string;
  idField: string;
  urlFields: string[];
}

const TARGET_TABLES: TableFieldMapping[] = [
  {
    table: "berkas_dokumen",
    idField: "id",
    urlFields: ["kk_url", "akta_kelahiran_url", "ijazah_url", "pas_foto_url", "bukti_pembayaran_url"],
  },
  {
    table: "kegiatan",
    idField: "id",
    urlFields: ["foto_url"],
  },
  {
    table: "fasilitas",
    idField: "id",
    urlFields: ["foto_url"],
  },
  {
    table: "galeri",
    idField: "id",
    urlFields: ["foto_url"],
  },
  {
    table: "pengaturan_web",
    idField: "id",
    urlFields: ["logo_url", "hero_image_url", "brosur_url", "mts_logo_url", "ma_logo_url"],
  },
  {
    table: "hero_section",
    idField: "id",
    urlFields: ["bg_image_url", "fg_image_url"],
  },
];

const isDryRun = process.argv.includes("--dry-run");

// Helper to extract clean object key from Firebase Storage download URL
function parseFirebaseStorageKey(firebaseUrl: string): string {
  try {
    const urlObj = new URL(firebaseUrl);
    // Typical path: /v0/b/<bucket>/o/<encoded-key>
    const match = urlObj.pathname.match(/\/o\/(.+)$/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    // Fallback: use pathname filename
    const parts = urlObj.pathname.split("/");
    return parts[parts.length - 1] || `migrated-${Date.now()}`;
  } catch {
    const clean = firebaseUrl.split("?")[0].split("/").pop();
    return clean || `migrated-${Date.now()}`;
  }
}

// Generate public R2 URL
function buildR2Url(key: string): string {
  const publicBaseUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  if (publicBaseUrl) {
    return `${publicBaseUrl}/${cleanKey}`;
  }
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET_NAME;
  return `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${cleanKey}`;
}

async function runMigration() {
  console.log("=========================================================");
  console.log("  MIGRASI MEDIA: FIREBASE STORAGE -> CLOUDFLARE R2");
  console.log(`  Mode: ${isDryRun ? "DRY-RUN (Simulasi / Tidak Mengubah Apapun)" : "EKSEKUSI PENUH"}`);
  console.log("=========================================================\n");

  const dbUrl = process.env.DATABASE_URL || "file:./local.db";
  const dbToken = process.env.DATABASE_AUTH_TOKEN;

  console.log(`[DB] Menghubungkan ke database: ${dbUrl.startsWith("file:") ? dbUrl : dbUrl.replace(/\/\/.*@/, "//***@")}`);
  const dbClient = createClient({
    url: dbUrl,
    authToken: dbToken,
  });

  let r2Client: S3Client | null = null;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!isDryRun) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error("\n❌ ERROR: Konfigurasi Cloudflare R2 belum lengkap di environment.");
      console.error("   Pastikan variabel berikut ada di .env.local:");
      console.error("   - R2_ACCOUNT_ID");
      console.error("   - R2_ACCESS_KEY_ID");
      console.error("   - R2_SECRET_ACCESS_KEY");
      console.error("   - R2_BUCKET_NAME");
      console.error("   - R2_PUBLIC_URL\n");
      process.exit(1);
    }

    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    console.log(`[R2] Client Cloudflare R2 siap. Target bucket: ${bucketName}`);
  } else {
    console.log("[R2] Mode Dry-Run: Koneksi R2 dilewati.\n");
  }

  let totalItemsScanned = 0;
  let totalFirebaseUrlsFound = 0;
  let totalSuccessfullyMigrated = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const target of TARGET_TABLES) {
    console.log(`\n---------------------------------------------------------`);
    console.log(`Memeriksa tabel: [${target.table}]`);
    console.log(`---------------------------------------------------------`);

    let rows: any[] = [];
    try {
      const res = await dbClient.execute(`SELECT * FROM ${target.table}`);
      rows = res.rows;
      console.log(`Ditemukan ${rows.length} baris data pada tabel ${target.table}.`);
    } catch (err: any) {
      console.warn(`⚠️ Gagal membaca tabel ${target.table}: ${err.message}`);
      continue;
    }

    for (const row of rows) {
      totalItemsScanned++;
      const idVal = row[target.idField];

      for (const field of target.urlFields) {
        const currentUrl = row[field];
        if (!currentUrl || typeof currentUrl !== "string") {
          continue;
        }

        if (!currentUrl.includes("firebasestorage.googleapis.com")) {
          totalSkipped++;
          continue;
        }

        totalFirebaseUrlsFound++;
        const r2Key = parseFirebaseStorageKey(currentUrl);
        const destinationR2Url = buildR2Url(r2Key);

        console.log(`\n[${target.table}:${idVal}] Field: ${field}`);
        console.log(`  Source Firebase: ${currentUrl}`);
        console.log(`  Target R2 Key  : ${r2Key}`);
        console.log(`  Target R2 URL  : ${destinationR2Url}`);

        if (isDryRun) {
          console.log(`  [DRY-RUN] Disimulasikan: Download Firebase -> Upload R2 -> Update DB.`);
          totalSuccessfullyMigrated++;
          continue;
        }

        try {
          // 1. Download file from Firebase Storage
          console.log(`  -> Mengunduh dari Firebase...`);
          const downloadRes = await fetch(currentUrl);
          if (!downloadRes.ok) {
            throw new Error(`Download HTTP error: ${downloadRes.status} ${downloadRes.statusText}`);
          }

          const contentType = downloadRes.headers.get("content-type") || "application/octet-stream";
          const arrayBuffer = await downloadRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // 2. Upload to Cloudflare R2
          console.log(`  -> Mengunggah ke R2 (${buffer.length} bytes, type: ${contentType})...`);
          const uploadCmd = new PutObjectCommand({
            Bucket: bucketName!,
            Key: r2Key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: "public, max-age=31536000, immutable",
          });
          await r2Client!.send(uploadCmd);

          // 3. Update database row in Turso
          console.log(`  -> Memperbarui data URL di database...`);
          await dbClient.execute({
            sql: `UPDATE ${target.table} SET ${field} = ? WHERE ${target.idField} = ?`,
            args: [destinationR2Url, idVal],
          });

          console.log(`  ✅ Berhasil dimigrasikan!`);
          totalSuccessfullyMigrated++;
        } catch (error: any) {
          console.error(`  ❌ GAGAL migrasi item ini: ${error.message}`);
          totalFailed++;
          // Catatan: DB tidak diubah dan file sumber di Firebase tetap utuh.
        }
      }
    }
  }

  console.log(`\n=========================================================`);
  console.log(`  RINGKASAN HASIL MIGRASI`);
  console.log(`=========================================================`);
  console.log(`Mode Operasi           : ${isDryRun ? "DRY-RUN (Simulasi)" : "EKSEKUSI NYATA"}`);
  console.log(`Total Baris Diperiksa  : ${totalItemsScanned}`);
  console.log(`Total Media Firebase   : ${totalFirebaseUrlsFound}`);
  console.log(`Berhasil Dimigrasikan  : ${totalSuccessfullyMigrated}`);
  console.log(`Gagal / Error          : ${totalFailed}`);
  console.log(`Dilewati (Non-Firebase): ${totalSkipped}`);
  console.log(`Sumber Firebase Dihapus: 0 (Semua berkas asli dipertahankan)`);
  console.log(`=========================================================\n`);

  if (isDryRun) {
    console.log("ℹ️  Ini adalah simulasi dry-run. Database dan storage belum diubah.");
    console.log("   Setelah konfigurasi R2 lengkap dan dikonfirmasi, jalankan tanpa flag --dry-run.\n");
  }
}

runMigration().catch((err) => {
  console.error("Fatal error saat menjalankan migrasi:", err);
  process.exit(1);
});

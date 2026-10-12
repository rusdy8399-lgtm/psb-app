/**
 * Reset Firebase Storage URLs Script
 * Resets dead Firebase Storage URLs to clean placeholders or empty strings
 * so new media can be cleanly uploaded via CMS website into Cloudflare R2.
 */

import { createClient } from "@libsql/client";

async function resetMedia() {
  const dbUrl = process.env.DATABASE_URL || "file:./local.db";
  const dbToken = process.env.DATABASE_AUTH_TOKEN;

  console.log("Connecting to database:", dbUrl.startsWith("file:") ? dbUrl : dbUrl.replace(/\/\/.*@/, "//***@"));
  const client = createClient({
    url: dbUrl,
    authToken: dbToken,
  });

  console.log("\n1. Resetting berkas_dokumen...");
  const bRes = await client.execute(`
    UPDATE berkas_dokumen 
    SET kk_url = CASE WHEN kk_url LIKE '%firebasestorage%' THEN '' ELSE kk_url END,
        akta_kelahiran_url = CASE WHEN akta_kelahiran_url LIKE '%firebasestorage%' THEN '' ELSE akta_kelahiran_url END,
        ijazah_url = CASE WHEN ijazah_url LIKE '%firebasestorage%' THEN '' ELSE ijazah_url END,
        pas_foto_url = CASE WHEN pas_foto_url LIKE '%firebasestorage%' THEN '' ELSE pas_foto_url END,
        bukti_pembayaran_url = CASE WHEN bukti_pembayaran_url LIKE '%firebasestorage%' THEN '' ELSE bukti_pembayaran_url END
    WHERE kk_url LIKE '%firebasestorage%' 
       OR akta_kelahiran_url LIKE '%firebasestorage%'
       OR ijazah_url LIKE '%firebasestorage%'
       OR pas_foto_url LIKE '%firebasestorage%'
       OR bukti_pembayaran_url LIKE '%firebasestorage%'
  `);
  console.log(`   Updated ${bRes.rowsAffected} rows in berkas_dokumen.`);

  console.log("\n2. Resetting kegiatan...");
  const kRes = await client.execute(`
    UPDATE kegiatan 
    SET foto_url = '' 
    WHERE foto_url LIKE '%firebasestorage%'
  `);
  console.log(`   Updated ${kRes.rowsAffected} rows in kegiatan.`);

  console.log("\n3. Resetting fasilitas...");
  const fRes = await client.execute(`
    UPDATE fasilitas 
    SET foto_url = '' 
    WHERE foto_url LIKE '%firebasestorage%'
  `);
  console.log(`   Updated ${fRes.rowsAffected} rows in fasilitas.`);

  console.log("\n4. Resetting galeri...");
  const gRes = await client.execute(`
    UPDATE galeri 
    SET foto_url = '' 
    WHERE foto_url LIKE '%firebasestorage%'
  `);
  console.log(`   Updated ${gRes.rowsAffected} rows in galeri.`);

  console.log("\n5. Resetting pengaturan_web...");
  const pRes = await client.execute(`
    UPDATE pengaturan_web 
    SET logo_url = '/logo-navbar.jpg',
        hero_image_url = '',
        brosur_url = '',
        mts_logo_url = '',
        ma_logo_url = ''
    WHERE logo_url LIKE '%firebasestorage%' 
       OR hero_image_url LIKE '%firebasestorage%' 
       OR brosur_url LIKE '%firebasestorage%'
       OR mts_logo_url LIKE '%firebasestorage%'
       OR ma_logo_url LIKE '%firebasestorage%'
  `);
  console.log(`   Updated ${pRes.rowsAffected} rows in pengaturan_web.`);

  console.log("\n6. Resetting hero_section...");
  // Use high-quality Unsplash educational campus placeholders for default banners
  const bannerPlaceholder1 = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
  const bannerPlaceholder2 = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

  const sliders = await client.execute("SELECT id FROM hero_section ORDER BY `order` ASC");
  if (sliders.rows.length > 0) {
    if (sliders.rows[0]) {
      await client.execute({
        sql: "UPDATE hero_section SET bg_image_url = ?, fg_image_url = '' WHERE id = ?",
        args: [bannerPlaceholder1, sliders.rows[0].id],
      });
    }
    if (sliders.rows[1]) {
      await client.execute({
        sql: "UPDATE hero_section SET bg_image_url = ?, fg_image_url = '' WHERE id = ?",
        args: [bannerPlaceholder2, sliders.rows[1].id],
      });
    }
  }
  console.log(`   Updated ${sliders.rows.length} rows in hero_section.`);

  console.log("\n✅ Berhasil mereset semua berkas lama Firebase di database!");
  console.log("   Semua data teks (judul, artikel, visi-misi, fasilitas) tetap aman.");
  console.log("   Media baru kini siap diunggah melalui CMS website ke Cloudflare R2.");
}

resetMedia().catch(err => {
  console.error("Error resetting media:", err);
  process.exit(1);
});

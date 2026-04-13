const { createClient } = require('@libsql/client');
const path = require('path');

const client = createClient({
  url: 'file:./local.db',
});

async function migrate() {
  console.log('Starting manual migration...');
  
  const queries = [
    // Pendaftar
    `ALTER TABLE pendaftar ADD COLUMN nik TEXT`,
    `ALTER TABLE pendaftar ADD COLUMN nisn TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE pendaftar ADD COLUMN no_kk TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE pendaftar ADD COLUMN anak_ke INTEGER`,
    `ALTER TABLE pendaftar ADD COLUMN jumlah_saudara INTEGER`,
    `ALTER TABLE pendaftar ADD COLUMN confirmed_at INTEGER`,
    
    // Ortu Wakil
    `ALTER TABLE ortu_wakil ADD COLUMN penghasilan_ayah TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE ortu_wakil ADD COLUMN no_hp_wali TEXT NOT NULL DEFAULT ''`,
    
    // Berkas Dokumen
    `ALTER TABLE berkas_dokumen ADD COLUMN nama_pengirim TEXT NOT NULL DEFAULT ''`,
    `ALTER TABLE berkas_dokumen ADD COLUMN tanggal_transfer TEXT NOT NULL DEFAULT ''`,
  ];

  for (const query of queries) {
    try {
      console.log(`Executing: ${query}`);
      await client.execute(query);
      console.log('Success');
    } catch (e) {
      console.warn(`Skipping or Failed: ${e.message}`);
    }
  }

  console.log('Migration finished.');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});

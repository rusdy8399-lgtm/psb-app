import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Better Auth Schema (Required)
export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
	image: text("image"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => user.id)
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
	refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});


// Domain Schema - PSB
export const pendaftar = sqliteTable("pendaftar", {
  id: text("id").primaryKey(),
  kodePendaftaran: text("kode_pendaftaran").notNull().unique(),
  namaLengkap: text("nama_lengkap").notNull(),
  tempatLahir: text("tempat_lahir").notNull(),
  tanggalLahir: text("tanggal_lahir").notNull(),
  jenisKelamin: text("jenis_kelamin").notNull(), // 'L' | 'P'
  jenjang: text("jenjang").notNull(), // 'MTs' | 'MA'
  alamat: text("alamat").notNull(),
  noHp: text("no_hp"),
  email: text("email"),
  asalSekolah: text("asal_sekolah").notNull(),
  nik: text("nik"),
  nisn: text("nisn").notNull(),
  noKk: text("no_kk").notNull(),
  anakKe: integer("anak_ke"),
  jumlahSaudara: integer("jumlah_saudara"),
  status: text("status").default("Terdaftar").notNull(), // 'Terdaftar'
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  confirmedAt: integer("confirmed_at", { mode: "timestamp" }),
});

export const ortuWakil = sqliteTable("ortu_wakil", {
  id: text("id").primaryKey(),
  pendaftarId: text("pendaftar_id").notNull().references(() => pendaftar.id, { onDelete: 'cascade' }),
  namaAyah: text("nama_ayah").notNull(),
  pekerjaanAyah: text("pekerjaan_ayah").notNull(),
  penghasilanAyah: text("penghasilan_ayah").notNull(),
  namaIbu: text("nama_ibu").notNull(),
  pekerjaanIbu: text("pekerjaan_ibu"),
  noHpWali: text("no_hp_wali").notNull(),
  alamatOrtu: text("alamat_ortu").notNull(),
});

export const berkasDokumen = sqliteTable("berkas_dokumen", {
  id: text("id").primaryKey(),
  pendaftarId: text("pendaftar_id").notNull().references(() => pendaftar.id, { onDelete: 'cascade' }),
  kkUrl: text("kk_url").notNull(),
  aktaKelahiranUrl: text("akta_kelahiran_url").notNull(),
  ijazahUrl: text("ijazah_url").notNull(),
  pasFotoUrl: text("pas_foto_url").notNull(),
  buktiPembayaranUrl: text("bukti_pembayaran_url").notNull(),
  namaPengirim: text("nama_pengirim").notNull(),
  tanggalTransfer: text("tanggal_transfer").notNull(),
});

export const kegiatan = sqliteTable("kegiatan", {
  id: text("id").primaryKey(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi").notNull(),
  tanggal: text("tanggal").notNull(),
  fotoUrl: text("foto_url").notNull(),
});

export const fasilitas = sqliteTable("fasilitas", {
  id: text("id").primaryKey(),
  nama: text("nama").notNull(),
  deskripsi: text("deskripsi").notNull(),
  fotoUrl: text("foto_url").notNull(),
});

export const galeri = sqliteTable("galeri", {
  id: text("id").primaryKey(),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi"),
  fotoUrl: text("foto_url").notNull(),
  tanggal: text("tanggal").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
});

export const pengaturanWeb = sqliteTable("pengaturan_web", {
  id: text("id").primaryKey(),
  namaWeb: text("nama_web").notNull().default("Pondok Pesantren Bali Bina Insani"),
  logoUrl: text("logo_url"),
  heroBadge: text("hero_badge").default("PENERIMAAN PESERTA DIDIK BARU 2026/2027"),
  heroTitle: text("hero_title").default("Membangun Generasi Rabbani Berilmu, Beramal, dan Berakhlaqul Karimah"),
  heroSubtitle: text("hero_subtitle").default("Pondok Pesantren Bali Bina Insani memadukan kurikulum nasional dan kepesantrenan untuk mencetak generasi muslim yang unggul di era digital."),
  heroImageUrl: text("hero_image_url"),
  heroForegroundImageUrl: text("hero_foreground_image_url"),
  visi: text("visi"),
  misi: text("misi"),
  alamat: text("alamat"),
  email: text("email"),
  noWa: text("no_wa"),
  igUrl: text("ig_url"),
  fbUrl: text("fb_url"),
  ytUrl: text("yt_url"),
  infoRekening: text("info_rekening").default("BRI: 0573010001017300 a.n. PSB Bali Bina Insani"),
  biayaRegistrasi: text("biaya_registrasi").default("200000"),
  brosurUrl: text("brosur_url"),
  // Jenjang MTs
  mtsLogoUrl: text("mts_logo_url"),
  mtsDeskripsi: text("mts_deskripsi"),
  mtsPoin: text("mts_poin"),
  // Jenjang MA
  maLogoUrl: text("ma_logo_url"),
  maDeskripsi: text("ma_deskripsi"),
  maPoin: text("ma_poin"),
});

export const heroSection = sqliteTable("hero_section", {
  id: text("id").primaryKey(),
  badge: text("badge").default("INFO PESANTREN"),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  bgImageUrl: text("bg_image_url").notNull(),
  fgImageUrl: text("fg_image_url"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  order: integer("order").default(0),
});

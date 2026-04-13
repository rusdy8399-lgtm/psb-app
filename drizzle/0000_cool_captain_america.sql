CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `berkas_dokumen` (
	`id` text PRIMARY KEY NOT NULL,
	`pendaftar_id` text NOT NULL,
	`ktp_ortu_url` text NOT NULL,
	`kk_url` text NOT NULL,
	`akta_kelahiran_url` text NOT NULL,
	`ijazah_url` text NOT NULL,
	`pas_foto_url` text NOT NULL,
	`bukti_pembayaran_url` text NOT NULL,
	FOREIGN KEY (`pendaftar_id`) REFERENCES `pendaftar`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fasilitas` (
	`id` text PRIMARY KEY NOT NULL,
	`nama` text NOT NULL,
	`deskripsi` text NOT NULL,
	`foto_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `kegiatan` (
	`id` text PRIMARY KEY NOT NULL,
	`judul` text NOT NULL,
	`deskripsi` text NOT NULL,
	`tanggal` text NOT NULL,
	`foto_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ortu_wakil` (
	`id` text PRIMARY KEY NOT NULL,
	`pendaftar_id` text NOT NULL,
	`nama_ayah` text NOT NULL,
	`nama_ibu` text NOT NULL,
	`pekerjaan_ayah` text NOT NULL,
	`pekerjaan_ibu` text NOT NULL,
	`no_hp_ortu` text NOT NULL,
	`alamat_ortu` text NOT NULL,
	FOREIGN KEY (`pendaftar_id`) REFERENCES `pendaftar`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pendaftar` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_pendaftaran` text NOT NULL,
	`nama_lengkap` text NOT NULL,
	`tempat_lahir` text NOT NULL,
	`tanggal_lahir` text NOT NULL,
	`jenis_kelamin` text NOT NULL,
	`jenjang` text NOT NULL,
	`alamat` text NOT NULL,
	`no_hp` text NOT NULL,
	`email` text,
	`asal_sekolah` text NOT NULL,
	`status` text DEFAULT 'Menunggu Konfirmasi' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`confirmed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pendaftar_kode_pendaftaran_unique` ON `pendaftar` (`kode_pendaftaran`);--> statement-breakpoint
CREATE TABLE `pengaturan_web` (
	`id` text PRIMARY KEY NOT NULL,
	`nama_web` text DEFAULT 'Pondok Pesantren Bali Bina Insani' NOT NULL,
	`logo_url` text,
	`visi` text,
	`misi` text,
	`alamat` text,
	`email` text,
	`no_wa` text,
	`ig_url` text,
	`fb_url` text,
	`yt_url` text,
	`info_rekening` text DEFAULT 'BRI: 0573010001017300 a.n. PSB Bali Bina Insani',
	`biaya_registrasi` text DEFAULT '200000'
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);

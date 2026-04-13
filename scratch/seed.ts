import { db } from "../src/lib/db";
import { heroSection, pengaturanWeb } from "../src/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

async function seed() {
  console.log("Seeding initial data...");

  // Seed Pengaturan Web
  const settingsId = uuidv4();
  await db.insert(pengaturanWeb).values({
    id: settingsId,
    namaWeb: "Pondok Pesantren Bali Bina Insani",
    logoUrl: "/logo.png",
    heroBadge: "PENERIMAAN PESERTA DIDIK BARU 2026/2027",
    heroTitle: "Membangun Generasi Rabbani Berilmu, Beramal, dan Berakhlaqul Karimah",
    heroSubtitle: "Pondok Pesantren Bali Bina Insani memadukan kurikulum nasional dan kepesantrenan untuk mencetak generasi muslim yang unggul di era digital.",
    heroImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    heroForegroundImageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=quran_readers&backgroundColor=transparent",
    visi: "Menjadi lembaga pendidikan Islam terpadu yang menghasilkan lulusan berakhlak mulia, cerdas, terampil, dan berwawasan global sesuai Qur'an & Sunnah.",
    misi: "1. Menyelenggarakan pendidikan yang memadukan ilmu agama dan sains. 2. Membangun karakter Islami melalui pembiasaan ibadah dan akhlak. 3. Mengembangkan potensi santri secara optimal melalui kegiatan keagamaan.",
    alamat: "Jl. Raya Bali Bina Insani, Kabupaten Tabanan, Bali, Indonesia",
    email: "info@balibinainsani.sch.id",
    noWa: "+62 812 3456 7890",
    igUrl: "https://instagram.com/balibinainsani",
    fbUrl: "https://facebook.com/balibinainsani",
    ytUrl: "https://youtube.com/balibinainsani",
    infoRekening: "BRI: 0573010001017300 a.n. PSB Bali Bina Insani",
    biayaRegistrasi: "200000",
  }).onConflictDoNothing();

  // Seed Slider Beranda
  const sliders = [
    {
      id: uuidv4(),
      badge: "PENERIMAAN PESERTA DIDIK BARU",
      title: "Melahirkan Generasi Qur'ani",
      subtitle: "Excellent with Integral Character",
      bgImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      fgImageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=quran1&backgroundColor=transparent",
      isActive: true,
      order: 1,
    },
    {
      id: uuidv4(),
      badge: "INFO PESANTREN",
      title: "Membentuk Karakter Islami",
      subtitle: "Berakhlak Mulia & Berpengetahuan Luas",
      bgImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      fgImageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=study1&backgroundColor=transparent",
      isActive: true,
      order: 2,
    },
    {
      id: uuidv4(),
      badge: "FASILITAS MODERN",
      title: "Sarana Belajar Lengkap",
      subtitle: "Mendukung Kenyamanan Belajar Santri",
      bgImageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      fgImageUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=building1&backgroundColor=transparent",
      isActive: true,
      order: 3,
    },
  ];

  for (const slider of sliders) {
    await db.insert(heroSection).values(slider).onConflictDoNothing();
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);

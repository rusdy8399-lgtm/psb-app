export type LembagaSlug = "paud" | "mi" | "mts" | "ma";

export interface BiayaItem {
  label: string;
  nominal: string;
  includes?: string[];
}

export interface LembagaInfo {
  slug: LembagaSlug;
  code: "PAUD" | "MI" | "MTs" | "MA";
  title: string;
  badge: string;
  tagline: string;
  defaultDeskripsi: string;
  defaultPoin: string[];
  programUnggulan: {
    title: string;
    description: string;
  }[];
  prestasi: {
    title: string;
    kategori: string;
    keterangan: string;
  }[];
  biaya: {
    headerLabel: string;
    catatan?: string;
    items: BiayaItem[];
  };
}

export const LEMBAGA_LIST: LembagaInfo[] = [
  {
    slug: "paud",
    code: "PAUD",
    title: "PAUD BALI BINA INSANI",
    badge: "Pendidikan Anak Usia Dini · Usia Minimal 3 Tahun",
    tagline: "Pendidikan anak usia dini dengan pembiasaan keagamaan, sosial-emosional, kemandirian, dan kemampuan dasar.",
    defaultDeskripsi:
      "Pendidikan anak usia dini (usia minimal 3 tahun) yang berfokus pada pembiasaan keagamaan, pengembangan sosial-emosional, kemandirian, dan kemampuan dasar melalui kegiatan belajar sambil bermain.",
    defaultPoin: [
      "Pembiasaan Keagamaan & Adab Sehari-hari",
      "Pengembangan Sosial-Emosional & Kemandirian",
      "Sensorik, Motorik, & Kreativitas Anak",
    ],
    programUnggulan: [
      {
        title: "A. Pembiasaan Keagamaan",
        description:
          "Membiasakan anak membaca doa sehari-hari, mengucapkan salam, serta mengenalkan perilaku santun dan nilai-nilai kebaikan.",
      },
      {
        title: "B. Pengembangan Sosial-Emosional",
        description:
          "Melatih anak berinteraksi dan bekerja sama, mengenali & mengelola emosi, serta menumbuhkan kebiasaan berbagi, mengantre, dan saling menghargai.",
      },
      {
        title: "C. Pengembangan Kemandirian",
        description:
          "Membiasakan anak merapikan mainan setelah digunakan, makan & menjaga kebersihan diri secara mandiri, serta melakukan kegiatan sederhana.",
      },
      {
        title: "D. Pengembangan Kemampuan Dasar",
        description:
          "Mengenalkan buku cerita & kegiatan membaca menyenangkan, kemampuan pra-menulis melalui bermain, serta melatih kreativitas, imajinasi, dan berpikir anak.",
      },
    ],
    prestasi: [
      {
        title: "Pembiasaan Doa & Adab",
        kategori: "Keagamaan",
        keterangan: "Anak terbiasa membaca doa sehari-hari, mengucapkan salam, dan berperilaku santun.",
      },
      {
        title: "Interaksi & Empati",
        kategori: "Sosial-Emosional",
        keterangan: "Anak terlatih bekerja sama, mengenali emosi, berbagi, mengantre, dan saling menghargai.",
      },
      {
        title: "Mandiri Sejak Dini",
        kategori: "Kemandirian",
        keterangan: "Anak terbiasa merapikan mainan, makan, dan menjaga kebersihan diri secara mandiri.",
      },
    ],
    biaya: {
      headerLabel: "PAUD / RA",
      catatan: "Rincian biaya resmi PAUD/RA dapat dikonfirmasi langsung kepada Panitia PSB.",
      items: [
        { label: "Pendaftaran", nominal: "Hubungi Panitia PSB" },
        {
          label: "Uang Pangkal",
          nominal: "Menyesuaikan Kebijakan",
          includes: ["Seragam Sekolah", "Buku & Alat Peraga", "Infaq Pendidikan"],
        },
        { label: "Bulanan / Syahriyah", nominal: "Menyesuaikan Kebijakan" },
        { label: "Extrakurikuler", nominal: "Termasuk Kegiatan Harian" },
      ],
    },
  },
  {
    slug: "mi",
    code: "MI",
    title: "Madrasah Ibtidaiyah",
    badge: "Setara SD · 6 Tahun (Kelas 1–6)",
    tagline: "Fondasi pendidikan dasar yang kuat dalam ilmu pengetahuan, tahfidz, dan akhlak mulia.",
    defaultDeskripsi:
      "Pendidikan dasar yang memadukan kurikulum nasional Kementerian Agama dengan pembinaan karakter Islami, literasi, numerasi, dan dasar-dasar tahfidz Al-Qur'an.",
    defaultPoin: [
      "Tahfidz Al-Qur'an (target Juz 30 & surat pilihan)",
      "Pembinaan ibadah harian & akhlakul karimah",
      "Pembelajaran dasar Bahasa Arab & Inggris",
    ],
    programUnggulan: [
      {
        title: "Kurikulum Terpadu Kemenag & Pesantren",
        description: "Memadukan mata pelajaran umum (Matematika, IPA, Bahasa) dengan Pendidikan Agama Islam yang kuat.",
      },
      {
        title: "Tahfidz & Tahsin Al-Qur'an",
        description: "Bimbingan membaca Al-Qur'an tartil sesuai tajwid serta target hafalan Juz 30 dan surat pilihan.",
      },
      {
        title: "Pembinaan Ibadah & Karakter",
        description: "Pembiasaan shalat berjamaah, hafalan hadits pilihan, dan pembentukan akhlakul karimah sehari-hari.",
      },
      {
        title: "Bilingual Dasar (Arab & Inggris)",
        description: "Pengenalan percakapan sehari-hari dan kosakata dasar Bahasa Arab dan Bahasa Inggris.",
      },
    ],
    prestasi: [
      {
        title: "Kompetisi Sains Madrasah (KSM) Tingkat Kabupaten",
        kategori: "Akademik",
        keterangan: "Partisipasi aktif dan prestasi pada bidang Matematika dan IPA terintegrasi.",
      },
      {
        title: "Musabaqah Hifdzil Qur'an (MHQ) Pelajar",
        kategori: "Tahfidz",
        keterangan: "Santri MI meraih juara pada cabang hafalan Juz 30 tingkat kabupaten/provinsi.",
      },
      {
        title: "Lomba Pidato & Pildacil Islami",
        kategori: "Bahasa & Dakwah",
        keterangan: "Melatih keberanian dan retorika santri dalam ajang perlombaan antar madrasah.",
      },
    ],
    biaya: {
      headerLabel: "MI",
      catatan: "Rincian biaya resmi MI dapat dikonfirmasi langsung kepada Panitia PSB.",
      items: [
        { label: "Pendaftaran", nominal: "Hubungi Panitia PSB" },
        {
          label: "Uang Pangkal",
          nominal: "Menyesuaikan Kebijakan",
          includes: ["Seragam Sekolah", "Buku Paket & Kitab Dasar", "Infaq Pengembangan"],
        },
        { label: "Bulanan / Syahriyah", nominal: "Menyesuaikan Kebijakan" },
        { label: "Extrakurikuler", nominal: "Menyesuaikan Pilihan" },
      ],
    },
  },
  {
    slug: "mts",
    code: "MTs",
    title: "Madrasah Tsanawiyah",
    badge: "Setara SMP · 3 Tahun (Kelas 7–9)",
    tagline: "Membangun fondasi ilmu agama, hafalan Al-Qur'an, dan wawasan keilmuan modern.",
    defaultDeskripsi:
      "Jenjang pertama yang memadukan kurikulum nasional Kementerian Agama dengan program kepesantrenan. Santri membangun fondasi ilmu agama, hafalan Al-Qur'an, dan karakter Islami sejak dini.",
    defaultPoin: [
      "Tahfidz Al-Qur'an (target 5 juz)",
      "Kajian Kitab Kuning dasar",
      "Bahasa Arab & Inggris aktif",
    ],
    programUnggulan: [
      {
        title: "Tahfidz Al-Qur'an (Target 5 Juz)",
        description: "Setoran hafalan rutin setiap hari dengan bimbingan musyrif/ah bersertifikat dan muraja'ah berkala.",
      },
      {
        title: "Kajian Kitab Kuning Dasar",
        description: "Pembelajaran ilmu alat (Nahwu, Sharaf) serta fiqih dan akhlak dasar khas pesantren.",
      },
      {
        title: "Bahasa Arab & Inggris Aktif",
        description: "Pembiasaan percakapan harian (muhadatsah & conversation) serta pidato tiga bahasa.",
      },
      {
        title: "Ekstrakurikuler & Kepanduan",
        description: "Pramuka, pencak silat, hadrah, kaligrafi, jurnalistik, serta pembinaan olahraga dan seni.",
      },
    ],
    prestasi: [
      {
        title: "Juara Kompetisi Sains Madrasah (KSM) Tingkat Provinsi",
        kategori: "Akademik",
        keterangan: "Meraih prestasi pada ajang KSM bidang Matematika, IPA, dan IPS terintegrasi.",
      },
      {
        title: "Juara Musabaqah Hifdzil Qur'an (MHQ)",
        kategori: "Tahfidz",
        keterangan: "Santri MTs menjuarai lomba tahfidz kategori 5 Juz tingkat kabupaten dan provinsi.",
      },
      {
        title: "Juara Pidato Bahasa Arab & Inggris",
        kategori: "Bahasa",
        keterangan: "Prestasi pada ajang Porseni Madrasah dan festival bahasa antar pesantren.",
      },
    ],
    biaya: {
      headerLabel: "MTs",
      items: [
        { label: "Pendaftaran", nominal: "Rp. 250.000" },
        {
          label: "Pangkal",
          nominal: "Rp. 7.998.000",
          includes: ["Bulanan", "Infaq", "Seragam", "Kitab", "Dipan & Kasur"],
        },
        { label: "Bulanan / Syahriyah", nominal: "Rp. 980.000" },
        { label: "Extrakurikuler", nominal: "Rp. 30.000" },
      ],
    },
  },
  {
    slug: "ma",
    code: "MA",
    title: "Madrasah Aliyah",
    badge: "Setara SMA · 3 Tahun (Kelas 10–12)",
    tagline: "Pendalaman ilmu agama komprehensif dan persiapan menuju perguruan tinggi unggulan.",
    defaultDeskripsi:
      "Jenjang lanjutan dengan pendalaman ilmu agama yang lebih komprehensif. Santri dipersiapkan untuk melanjutkan pendidikan ke perguruan tinggi dalam maupun luar negeri.",
    defaultPoin: [
      "Tahfidz Al-Qur'an (target 10 juz+)",
      "Kajian Kitab Kuning lanjutan",
      "Tahassus Bahasa Arab, Inggris & Jepang",
    ],
    programUnggulan: [
      {
        title: "Tahfidz Al-Qur'an (Target 10 Juz+)",
        description: "Program intensif menghafal Al-Qur'an dengan penguatan sanad bacaan dan pemahaman tafsir.",
      },
      {
        title: "Kajian Kitab Kuning Lanjutan",
        description: "Pendalaman fiqih, ushul fiqih, tafsir, hadits, dan tasawuf bersama para asatidz pesantren.",
      },
      {
        title: "Tahassus Bahasa Arab, Inggris & Jepang",
        description: "Program khusus penguasaan tiga bahasa asing untuk persiapan studi lanjut dan beasiswa internasional.",
      },
      {
        title: "Bimbingan Perguruan Tinggi & Life Skill",
        description: "Persiapan SNBP/SNBT, Timur Tengah, magang praktik kerja, kepemimpinan, dan kewirausahaan.",
      },
    ],
    prestasi: [
      {
        title: "Alumni Diterima di Perguruan Tinggi Negeri & Luar Negeri",
        kategori: "Studi Lanjut",
        keterangan: "Lulusan MA melanjutkan studi ke PTN ternama Indonesia maupun universitas di Timur Tengah & Asia.",
      },
      {
        title: "Juara KSM & Olimpiade Sains Tingkat Provinsi",
        kategori: "Akademik",
        keterangan: "Meraih medali pada kompetisi sains dan karya tulis ilmiah remaja.",
      },
      {
        title: "Juara MTQ, MQK & Debat Bahasa Asing",
        kategori: "Keagamaan & Bahasa",
        keterangan: "Prestasi santri pada Musabaqah Qira'atil Kutub dan debat Bahasa Arab/Inggris.",
      },
    ],
    biaya: {
      headerLabel: "MA",
      items: [
        { label: "Pendaftaran", nominal: "Rp. 250.000" },
        {
          label: "Pangkal",
          nominal: "Rp. 7.998.000",
          includes: ["Bulanan", "Infaq", "Seragam", "Kitab", "Dipan & Kasur"],
        },
        { label: "Bulanan / Syahriyah", nominal: "Rp. 980.000" },
        { label: "Extrakurikuler", nominal: "Rp. 30.000" },
      ],
    },
  },
];

export function getLembagaBySlug(slug: string): LembagaInfo | undefined {
  return LEMBAGA_LIST.find((item) => item.slug === slug.toLowerCase());
}


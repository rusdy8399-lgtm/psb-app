import { getSiteSettings, getActiveSliders } from "@/lib/data-fetching";
import { HeroSlider } from "@/components/public/HeroSlider";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Trophy, GraduationCap, ArrowRight, Library, Languages } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pesantren Bali | Pesantren Terbaik & Terakreditasi | Bina Insani",
  description: "Selamat Datang di Pesantren Bali Bina Insani (Est. 1991). Pilihan pesantren terbaik di Bali untuk pendidikan Islam terpadu, Tahfidz, dan karakter mulia. Daftar sekarang!",
  openGraph: {
    title: "Pesantren Bali | Pondok Pesantren Bali Bina Insani",
    description: "Pesantren modern terbaik di Bali dengan kurikulum terpadu.",
    url: "https://project-98lnv.vercel.app",
    type: "website" as const,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Pesantren Bali Bina Insani | Sekolah Islam Unggulan di Bali",
    description: "Pesantren dengan karakter integral dan wawasan global di Bali.",
  },
};

export default async function Home() {
  // Fetch site settings and active sliders in parallel
  const [settings, sliders] = await Promise.all([
    getSiteSettings(),
    getActiveSliders()
  ]);

  // Default slide if DB is empty (shouldn't happen with seed)
  const defaultSliders = [
    {
      id: "1",
      badge: settings?.heroBadge || "PENERIMAAN PESERTA DIDIK BARU",
      title: settings?.heroTitle || "Melahirkan<br />Generasi Qur'ani",
      subtitle: settings?.heroSubtitle || "Excellent with<br />Integral Character",
      bgImageUrl: settings?.heroImageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      fgImageUrl: settings?.heroForegroundImageUrl || "https://api.dicebear.com/7.x/shapes/svg?seed=quran_readers&backgroundColor=transparent",
    }
  ];

  const displaySliders = sliders.length > 0 ? sliders : defaultSliders;

  // Split Misi into array if it's a string
  const misiArray = settings?.misi?.split("\n").filter(m => m.trim() !== "") || [
    "Menyelenggarakan pendidikan yang memadukan ilmu agama dan sains.",
    "Membangun karakter Islami melalui pembiasaan ibadah dan akhlak.",
    "Mengembangkan potensi santri secara optimal melalui kegiatan keagamaan."
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Hero Slider */}
      <HeroSlider data={displaySliders} brosurUrl={settings?.brosurUrl} />

      {/* Tentang Kami - Redesigned */}
      <section className="py-12 bg-white" id="tentang">
        <div className="max-w-6xl mx-auto px-4">

          {/* Main 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            {/* Left Column: Text Content */}
            <div className="space-y-5">
              <span className="text-xs uppercase tracking-wide text-green-600 font-semibold">
                Profile Pesantren
              </span>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 leading-tight">
                Membangun Generasi Madani <br className="hidden md:block" />Secara Integral
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Pondok Pesantren Bali Bina Insani adalah lembaga pendidikan Islam terpadu yang berdiri di Pulau Dewata. Kami hadir untuk mencetak generasi yang unggul dalam ilmu agama, sains, dan teknologi — selaras dengan nilai-nilai Qur'ani.
              </p>

              {/* Visi Card */}
              <div className="rounded-xl border border-gray-100 shadow-sm p-5 bg-green-50/50">
                <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-green-600 text-white flex items-center justify-center text-xs font-bold">V</span>
                  Visi
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  {settings?.visi || "Menjadi lembaga pendidikan Islam terpadu yang menghasilkan lulusan berakhlak mulia, cerdas, terampil, dan berwawasan global sesuai Qur'an & Sunnah."}
                </p>
              </div>

              {/* Misi Card */}
              <div className="rounded-xl border border-gray-100 shadow-sm p-5 bg-white">
                <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-green-600 text-white flex items-center justify-center text-xs font-bold">M</span>
                  Misi
                </h3>
                <ul className="space-y-2">
                  {misiArray.map((misi, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm text-gray-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                      <span>{misi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="rounded-2xl overflow-hidden h-[400px] shadow-md border border-gray-100 relative image-shimmer">
              {settings?.heroImageUrl ? (
                <Image
                  src={settings.heroImageUrl}
                  alt="Kegiatan Pesantren Bali Bina Insani"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <BookOpen className="w-8 h-8 text-[#0f6c5e]" />
                    </div>
                    <p className="text-sm">Foto Kegiatan Pesantren</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Program Unggulan - 3 columns */}
          <div className="mt-10">
            <p className="text-xs uppercase tracking-wide text-green-600 font-semibold mb-4">Program Unggulan</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                {
                  Icon: BookOpen,
                  title: "Tahfidz Al-Qur'an",
                  badge: "Min. 5 Juz",
                  desc: "Program hafalan intensif dengan metode talaqqi, musyafahah, dan muraja'ah terjadwal."
                },
                {
                  Icon: Library,
                  title: "Kajian Kitab Kuning",
                  badge: "Klasik & Kontemporer",
                  desc: "Mempelajari kitab turats ulama salaf sebagai pondasi keilmuan Islam yang kuat."
                },
                {
                  Icon: Languages,
                  title: "Tahassus Bahasa",
                  badge: "Arab · Inggris · Jepang",
                  desc: "Pembiasaan percakapan aktif tiga bahasa untuk mencetak santri yang siap mendunia."
                },
              ] as const).map((item, idx) => (
                <div key={idx} className="rounded-xl border border-gray-100 shadow-sm p-5 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                    <item.Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-2">
                    {item.badge}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1.5">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Jenjang Pendidikan */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-wide text-green-600 font-semibold">Jenjang Pendidikan</span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 leading-tight mt-1">
              Dua Jenjang, Satu Visi
            </h2>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed mt-2 max-w-xl">
              Pondok Pesantren Bali Bina Insani menyelenggarakan pendidikan formal setingkat SMP dan SMA di bawah naungan Kementerian Agama.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* MTs Card */}
            <div className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white">
              <div className="h-1.5 bg-gradient-to-r from-green-500 to-emerald-400 w-full" />
              <div className="p-7">
                <div className="flex items-center gap-4 mb-5">
                  {settings?.mtsLogoUrl ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-green-100 shrink-0 relative">
                      <Image src={settings.mtsLogoUrl} alt="Logo MTs" fill className="object-contain p-1" sizes="56px" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-green-600 leading-none">MTs</span>
                      <span className="text-[9px] text-green-400 mt-0.5">Negeri / Swasta</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">Madrasah Tsanawiyah</h3>
                    <span className="inline-block text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                      Setara SMP · 3 Tahun (Kelas 7–9)
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {settings?.mtsDeskripsi || "Jenjang pertama yang memadukan kurikulum nasional Kementerian Agama dengan program kepesantrenan. Santri membangun fondasi ilmu agama, hafalan Al-Qur'an, dan karakter Islami sejak dini."}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {(settings?.mtsPoin ? settings.mtsPoin.split("\n").filter(p => p.trim()) : [
                    "Tahfidz Al-Qur'an (target 5 juz)",
                    "Kajian Kitab Kuning dasar",
                    "Bahasa Arab & Inggris aktif",
                  ]).map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* MA Card */}
            <div className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white">
              <div className="h-1.5 bg-gradient-to-r from-[#1A4D2E] to-green-600 w-full" />
              <div className="p-7">
                <div className="flex items-center gap-4 mb-5">
                  {settings?.maLogoUrl ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#1A4D2E]/10 shrink-0 relative">
                      <Image src={settings.maLogoUrl} alt="Logo MA" fill className="object-contain p-1" sizes="56px" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#1A4D2E]/5 border border-[#1A4D2E]/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#1A4D2E] leading-none">MA</span>
                      <span className="text-[9px] text-green-600/60 mt-0.5">Negeri / Swasta</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">Madrasah Aliyah</h3>
                    <span className="inline-block text-[11px] font-semibold text-[#1A4D2E] bg-[#1A4D2E]/10 px-2 py-0.5 rounded-full mt-1">
                      Setara SMA · 3 Tahun (Kelas 10–12)
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {settings?.maDeskripsi || "Jenjang lanjutan dengan pendalaman ilmu agama yang lebih komprehensif. Santri dipersiapkan untuk melanjutkan pendidikan ke perguruan tinggi dalam maupun luar negeri."}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {(settings?.maPoin ? settings.maPoin.split("\n").filter(p => p.trim()) : [
                    "Tahfidz Al-Qur'an (target 10 juz+)",
                    "Kajian Kitab Kuning lanjutan",
                    "Tahassus Bahasa Arab, Inggris & Jepang",
                  ]).map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A4D2E] shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Memilih Kami - Consistent with Tentang Kami style */}
      <section className="py-12 bg-slate-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <span className="text-xs uppercase tracking-wide text-green-600 font-semibold">Keunggulan Kami</span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 leading-tight mt-1">Kenapa Memilih Kami?</h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mt-2 max-w-xl">
              Kami berkomitmen memberikan pendidikan terbaik dengan keseimbangan ilmu agama, ilmu umum, dan pembentukan karakter.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Kurikulum Integral", desc: "Perpaduan kurikulum Diknas dan Pesantren Hidayatullah yang teruji.", icon: BookOpen },
              { title: "Tenaga Pendidik", desc: "Ustadz/ah kompeten, berpengalaman, dan berdedikasi tinggi.", icon: GraduationCap },
              { title: "Fasilitas Kondusif", desc: "Lingkungan belajar yang asri, aman, dan tertib.", icon: Users },
              { title: "Karakter Islami", desc: "Pembiasaan ibadah sunnah dan adab islami setiap hari.", icon: Trophy },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Compact */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#0f6c5e] rounded-3xl p-10 md:py-14 md:px-16 text-center relative overflow-hidden shadow-lg">
            {/* Subtle blur decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

            <h2 className="relative text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Daftarkan Putra-Putri Anda Sekarang
            </h2>
            <p className="relative text-sm md:text-base text-white/80 mt-4 max-w-xl mx-auto leading-relaxed">
              Bergabunglah bersama kami untuk mencetak generasi yang Qur'ani, Berilmu, dan Berkarakter.
            </p>
            <div className="relative mt-6">
              <Link href="/ppdb">
                <Button className="bg-gold hover:bg-yellow-500 text-[#1A4D2E] font-medium px-5 py-3 h-auto rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto">
                  Klik Disini Untuk Mendaftar <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

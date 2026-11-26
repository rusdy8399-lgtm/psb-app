import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  Coins,
  Heart,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LembagaInfo } from "@/lib/lembaga-data";

interface PaudLandingViewProps {
  lembaga: LembagaInfo;
  settings: {
    paudLogoUrl?: string | null;
    paudBannerUrl?: string | null;
    paudDeskripsi?: string | null;
    noWa?: string | null;
    alamat?: string | null;
    infoRekening?: string | null;
  } | null;
  galeriItems: {
    id: string;
    judul: string;
    fotoUrl: string;
    deskripsi: string | null;
  }[];
}

export function PaudLandingView({
  lembaga,
  settings,
  galeriItems,
}: PaudLandingViewProps) {
  const waNumber = (settings?.noWa || "6281234567890").replace(/\D/g, "");
  const deskripsi = settings?.paudDeskripsi || lembaga.defaultDeskripsi;

  const paudFirstGaleri = [
    ...galeriItems.filter(
      (g) =>
        g.judul.toLowerCase().includes("paud") ||
        (g.deskripsi || "").toLowerCase().includes("paud")
    ),
    ...galeriItems.filter(
      (g) =>
        !g.judul.toLowerCase().includes("paud") &&
        !(g.deskripsi || "").toLowerCase().includes("paud")
    ),
  ];
  const previewGaleri = paudFirstGaleri.slice(0, 6);

  const cuteFrames = [
    { border: "border-pink-200 bg-pink-50/40", tape: "bg-pink-300/80", tilt: "-rotate-2" },
    { border: "border-amber-200 bg-amber-50/40", tape: "bg-amber-300/80", tilt: "rotate-2" },
    { border: "border-sky-200 bg-sky-50/40", tape: "bg-sky-300/80", tilt: "-rotate-1" },
    { border: "border-emerald-200 bg-emerald-50/40", tape: "bg-emerald-300/80", tilt: "rotate-1" },
    { border: "border-purple-200 bg-purple-50/40", tape: "bg-purple-300/80", tilt: "-rotate-2" },
    { border: "border-orange-200 bg-orange-50/40", tape: "bg-orange-300/80", tilt: "rotate-2" },
  ];

  const defaultLabels = [
    "Sensorik & Motorik",
    "Selasa Sehat",
    "Kamis Bergambar",
    "Pembiasaan Keagamaan",
    "Kreativitas Anak",
    "Bermain Bersama",
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* 1. Top Hero Banner (Custom Photo or Playful Mountain Illustration) */}
      {settings?.paudBannerUrl ? (
        <section className="relative h-64 sm:h-80 md:h-[400px] w-full overflow-hidden bg-sky-100">
          <Image
            src={settings.paudBannerUrl}
            alt="Banner PAUD Bali Bina Insani"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/15" />
          <div className="max-w-6xl mx-auto px-4 pt-6 relative z-20 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-900 bg-white/90 hover:bg-white px-3.5 py-2 rounded-full shadow-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
            </Link>

            <Link href="/pendaftaran?jenjang=PAUD">
              <Button className="bg-amber-400 hover:bg-amber-300 text-sky-950 font-bold rounded-full px-5 h-9 text-xs shadow-sm">
                Daftar PAUD Sekarang
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        <section className="relative bg-gradient-to-b from-[#7DD3FC] via-[#BAE6FD] to-[#E0F2FE] pt-6 pb-0 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 relative z-20 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-900 bg-white/85 hover:bg-white px-3.5 py-2 rounded-full shadow-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
            </Link>

            <Link href="/pendaftaran?jenjang=PAUD">
              <Button className="bg-amber-400 hover:bg-amber-300 text-sky-950 font-bold rounded-full px-5 h-9 text-xs shadow-sm">
                Daftar PAUD Sekarang
              </Button>
            </Link>
          </div>

          {/* Playful Hills & Flags SVG Illustration */}
          <div className="relative mt-6 h-48 sm:h-60 md:h-72 w-full">
            {/* Clouds */}
            <div className="absolute top-3 left-[8%] w-20 h-9 bg-white/80 rounded-full blur-[0.5px]" />
            <div className="absolute top-8 right-[12%] w-28 h-10 bg-white/80 rounded-full blur-[0.5px]" />
            <div className="absolute top-4 left-[45%] w-16 h-7 bg-white/70 rounded-full" />

            {/* Sun */}
            <div className="absolute top-2 right-[28%] w-12 h-12 rounded-full bg-amber-300 shadow-[0_0_30px_rgba(252,211,77,0.8)] flex items-center justify-center">
              <Sun className="w-6 h-6 text-amber-600" />
            </div>

            <svg
              viewBox="0 0 1200 280"
              className="absolute bottom-0 left-0 w-full h-full preserve-3d"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Left Hill */}
              <path
                d="M0,280 L0,180 Q180,40 390,280 Z"
                fill="#F8FAFC"
                stroke="#38BDF8"
                strokeWidth="8"
              />
              {/* Middle Hill */}
              <path
                d="M320,280 Q590,20 860,280 Z"
                fill="#F0FDF4"
                stroke="#22C55E"
                strokeWidth="8"
              />
              {/* Right Hill */}
              <path
                d="M780,280 Q1000,45 1200,195 L1200,280 Z"
                fill="#FFFBEB"
                stroke="#0EA5E9"
                strokeWidth="8"
              />
              {/* Colorful Handprint-like Dots */}
              <circle cx="170" cy="195" r="8" fill="#EF4444" opacity="0.8" />
              <circle cx="215" cy="165" r="9" fill="#22C55E" opacity="0.8" />
              <circle cx="245" cy="215" r="7" fill="#F59E0B" opacity="0.85" />
              <circle cx="135" cy="225" r="8" fill="#3B82F6" opacity="0.8" />

              <circle cx="560" cy="155" r="9" fill="#F97316" opacity="0.8" />
              <circle cx="615" cy="175" r="8" fill="#EC4899" opacity="0.8" />
              <circle cx="585" cy="215" r="10" fill="#10B981" opacity="0.8" />
              <circle cx="655" cy="220" r="7" fill="#6366F1" opacity="0.8" />

              <circle cx="960" cy="180" r="8" fill="#EF4444" opacity="0.8" />
              <circle cx="1015" cy="160" r="9" fill="#14B8A6" opacity="0.8" />
              <circle cx="1040" cy="215" r="8" fill="#F59E0B" opacity="0.85" />
              <circle cx="925" cy="225" r="7" fill="#8B5CF6" opacity="0.8" />

              {/* Flag Poles */}
              <line x1="185" y1="158" x2="185" y2="75" stroke="#1E293B" strokeWidth="4" />
              <rect x="185" y="75" width="46" height="28" rx="3" fill="#22C55E" />

              <line x1="590" y1="148" x2="590" y2="55" stroke="#1E293B" strokeWidth="4" />
              <rect x="590" y="55" width="48" height="30" rx="3" fill="#F59E0B" />

              <line x1="1000" y1="158" x2="1000" y2="72" stroke="#1E293B" strokeWidth="4" />
              <rect x="1000" y="72" width="46" height="28" rx="3" fill="#EF4444" />
            </svg>
          </div>
        </section>
      )}

      {/* 2. Welcome Section: Selamat Datang di PAUD BALI BINA INSANI */}
      <section className="bg-white py-12 px-4 text-center relative">
        <div className="max-w-3xl mx-auto space-y-3">
          {settings?.paudLogoUrl && (
            <div className="w-20 h-20 mx-auto mb-3 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden bg-white p-1.5">
              <Image
                src={settings.paudLogoUrl}
                alt="Logo PAUD Bali Bina Insani"
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </div>
          )}
          <p className="text-sm md:text-base font-medium text-slate-500">
            Selamat Datang di
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#00A8E8] tracking-tight font-heading">
            PAUD BALI BINA INSANI
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed pt-2">
            {deskripsi}
          </p>
        </div>
      </section>

      {/* 3. Bunting Flags + Sky Blue Section: Program Kami */}
      <section className="relative bg-[#BFE8F5] pt-10 pb-16">
        {/* Colorful Bunting Flags SVG */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 44" className="w-full h-9 md:h-11" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,2 Q600,18 1200,2" fill="none" stroke="#64748B" strokeWidth="2" />
            {Array.from({ length: 24 }).map((_, i) => {
              const x = i * 50;
              const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#EC4899"];
              return (
                <polygon
                  key={i}
                  points={`${x + 5},6 ${x + 45},6 ${x + 25},38`}
                  fill={colors[i % colors.length]}
                />
              );
            })}
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-4 mt-4 space-y-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Card Illustration / Photo */}
            <div className="bg-white p-3 rounded-2xl shadow-md border-4 border-white rotate-[-1deg] hover:rotate-0 transition-transform">
              <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {previewGaleri[0]?.fotoUrl ? (
                  <Image
                    src={previewGaleri[0].fotoUrl}
                    alt="Kegiatan PAUD Bali Bina Insani"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-[#00A8E8] mb-3">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-sky-900 text-lg">Belajar Ceria &amp; Islami</p>
                    <p className="text-xs text-sky-700 mt-1 max-w-xs">
                      Pendekatan bermain edukatif, pembiasaan keagamaan, dan pengembangan kemandirian anak.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right Program Mingguan */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0096C7]">
                Program Mingguan
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                PAUD Bali Bina Insani menerima peserta didik dengan usia minimal 3 tahun melalui
                kegiatan tematik mingguan yang terarah dan menyenangkan:
              </p>

              <div className="bg-white/95 rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 bg-[#0096C7] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2.5">
                  <div className="col-span-3">Hari</div>
                  <div className="col-span-4">Nama Program</div>
                  <div className="col-span-5">Bentuk Kegiatan</div>
                </div>
                {[
                  {
                    hari: "Senin",
                    nama: "Sensorik dan Motorik",
                    kegiatan: "Bermain pasir, tepung, air, menyusun balok, dan eksplorasi tekstur",
                  },
                  {
                    hari: "Selasa",
                    nama: "Selasa Sehat",
                    kegiatan: "Olahraga, senam, permainan fisik, dan jalan santai",
                  },
                  {
                    hari: "Kamis",
                    nama: "Kamis Bergambar",
                    kegiatan: "Menggambar, mewarnai, mengenal bentuk, dan pengenalan coding sederhana",
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 px-4 py-3 text-xs border-b border-sky-100 last:border-none items-start"
                  >
                    <div className="col-span-3 font-extrabold text-[#0096C7]">{row.hari}</div>
                    <div className="col-span-4 font-bold text-slate-800">{row.nama}</div>
                    <div className="col-span-5 text-slate-600 leading-snug">{row.kegiatan}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <Link href="/pendaftaran?jenjang=PAUD">
                  <span className="inline-block bg-[#00A8E8] hover:bg-[#0096C7] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors">
                    Daftar PAUD Sekarang
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Program Khusus */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-extrabold text-[#0096C7] text-center">
              Program Khusus
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "A. Pembiasaan Keagamaan",
                  items: [
                    "Membiasakan anak membaca doa sehari-hari.",
                    "Membiasakan mengucapkan salam.",
                    "Mengenalkan perilaku santun dan nilai-nilai kebaikan.",
                  ],
                },
                {
                  title: "B. Pengembangan Sosial-Emosional",
                  items: [
                    "Melatih anak berinteraksi dan bekerja sama.",
                    "Mengenalkan cara mengenali dan mengelola emosi.",
                    "Menumbuhkan kebiasaan berbagi, mengantre, dan saling menghargai.",
                  ],
                },
                {
                  title: "C. Pengembangan Kemandirian",
                  items: [
                    "Membiasakan anak merapikan mainan setelah digunakan.",
                    "Melatih anak makan dan menjaga kebersihan diri secara mandiri.",
                    "Membiasakan anak melakukan kegiatan sederhana tanpa selalu bergantung pada guru.",
                  ],
                },
                {
                  title: "D. Pengembangan Kemampuan Dasar",
                  items: [
                    "Mengenalkan buku cerita dan kegiatan membaca yang menyenangkan.",
                    "Mengembangkan kemampuan pra-menulis melalui aktivitas bermain.",
                    "Melatih kreativitas, imajinasi, dan kemampuan berpikir anak.",
                  ],
                },
              ].map((prog, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 rounded-2xl p-5 border border-sky-200 shadow-sm space-y-2.5"
                >
                  <h4 className="font-extrabold text-sm md:text-base text-[#0096C7]">
                    {prog.title}
                  </h4>
                  <ul className="space-y-1.5">
                    {prog.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00A8E8] shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Grass Edge + Bright Green Feature Section */}
      <section className="relative bg-[#8BC34A] pt-12 pb-16 text-white">
        {/* Scalloped Grass Top */}
        <div className="absolute -top-5 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 30" className="w-full h-6" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0,30 Q15,0 30,30 Q45,0 60,30 Q75,0 90,30 Q105,0 120,30 Q135,0 150,30 Q165,0 180,30 Q195,0 210,30 Q225,0 240,30 Q255,0 270,30 Q285,0 300,30 Q315,0 330,30 Q345,0 360,30 Q375,0 390,30 Q405,0 420,30 Q435,0 450,30 Q465,0 480,30 Q495,0 510,30 Q525,0 540,30 Q555,0 570,30 Q585,0 600,30 Q615,0 630,30 Q645,0 660,30 Q675,0 690,30 Q705,0 720,30 Q735,0 750,30 Q765,0 780,30 Q795,0 810,30 Q825,0 840,30 Q855,0 870,30 Q885,0 900,30 Q915,0 930,30 Q945,0 960,30 Q975,0 990,30 Q1005,0 1020,30 Q1035,0 1050,30 Q1065,0 1080,30 Q1095,0 1110,30 Q1125,0 1140,30 Q1155,0 1170,30 Q1185,0 1200,30 Z"
              fill="#8BC34A"
            />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-10">
            Keunggulan PAUD
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                label: "Pembiasaan Doa Harian, Salam & Perilaku Santun",
              },
              {
                icon: Heart,
                color: "text-rose-500",
                bg: "bg-rose-50",
                label: "Pengembangan Sosial-Emosional & Kemandirian Anak",
              },
              {
                icon: Palette,
                color: "text-amber-500",
                bg: "bg-amber-50",
                label: "Sensorik, Motorik, Olahraga & Kreativitas Menggambar",
              },
            ].map((feat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-40 h-32 rounded-[45%] bg-white shadow-md flex items-center justify-center border-4 border-lime-200 mb-4">
                  <div className={`w-16 h-16 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center`}>
                    <feat.icon className="w-8 h-8" />
                  </div>
                </div>
                <div className="bg-[#DCE775] text-lime-950 font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg shadow-sm max-w-[260px]">
                  {feat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Galeri Kegiatan PAUD dengan Bingkai Lucu (White Section) */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#00A8E8]">
              Galeri Kegiatan PAUD
            </h2>
            <p className="text-xs md:text-sm text-slate-500">
              Momen ceria belajar, bermain, dan berkarya santri PAUD Bali Bina Insani
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {/* 6 Cute Polaroid Photo Frames */}
            {cuteFrames.map((frame, idx) => {
              const photo = previewGaleri[idx];
              const caption = photo?.judul || defaultLabels[idx];

              return (
                <div
                  key={idx}
                  className={`relative rounded-2xl p-2.5 pb-3 border-2 ${frame.border} shadow-sm ${frame.tilt} hover:rotate-0 hover:scale-[1.03] transition-all duration-300 flex flex-col`}
                >
                  {/* Cute Tape Accent */}
                  <div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 rounded-sm ${frame.tape} shadow-2xs z-10`}
                    aria-hidden="true"
                  />

                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white border border-slate-100">
                    {photo?.fotoUrl ? (
                      <Image
                        src={photo.fotoUrl}
                        alt={caption}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 300px"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50/80 gap-1.5">
                        <Camera className="w-6 h-6" />
                        <span className="text-[10px] font-semibold">Foto PAUD</span>
                      </div>
                    )}
                  </div>

                  <p className="mt-2.5 text-center text-[11px] font-bold text-slate-700 truncate px-1">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Informasi & Biaya Pendaftaran Santri Baru (Light Blue Section) */}
      <section className="py-14 bg-[#BFE8F5] border-t border-sky-200/70">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="text-center">
            <div className="inline-block bg-[#C68B59] text-white font-extrabold text-lg px-6 py-2 rounded-xl border-4 border-[#8D5B34] shadow-sm">
              Informasi PSB PAUD
            </div>
            <p className="text-xs text-slate-600 mt-3">
              Informasi resmi pendaftaran &amp; rincian biaya PAUD Bali Bina Insani
            </p>
          </div>

          {/* Biaya Card */}
          <div className="bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3.5 flex items-center gap-2.5 text-white">
              <Coins className="w-5 h-5" />
              <div>
                <h3 className="text-sm md:text-base font-extrabold uppercase tracking-wide">
                  Biaya Pendaftaran PAUD
                </h3>
              </div>
            </div>
            <div className="bg-[#0B5D46] text-white text-xs md:text-sm">
              {lembaga.biaya.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 border-b border-white/20 last:border-none"
                >
                  <div className="col-span-6 px-5 py-3.5">
                    <p className="font-semibold">{item.label}</p>
                    {item.includes && (
                      <div className="mt-1 space-y-0.5 text-[11px] text-white/85">
                        {item.includes.map((inc, i) => (
                          <p key={i}>• {inc}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-span-6 px-5 py-3.5 border-l border-white/20 font-bold">
                    <p>{item.nominal}</p>
                    {item.includes && (
                      <div className="mt-1 space-y-0.5 text-amber-300">
                        {item.includes.map((_, i) => (
                          <p key={i} className="flex items-center">
                            <Check className="w-3.5 h-3.5" />
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {lembaga.biaya.catatan && (
              <div className="px-5 py-2.5 bg-amber-50 text-[11px] text-amber-800 font-medium">
                * {lembaga.biaya.catatan}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Green Grass Bottom Quick Links & CTA */}
      <section className="relative bg-[#7CB342] text-white py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold">PAUD BALI BINA INSANI</h3>
            <p className="text-xs text-white/90 flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {settings?.alamat || "Jl. Melati No.31, Desa Meliling, Kec. Kerambitan, Tabanan, Bali"}
            </p>
            <p className="text-xs text-white/90 flex items-center justify-center md:justify-start gap-1.5">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              WhatsApp Panitia PSB: +{waNumber}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/pendaftaran?jenjang=PAUD">
              <Button className="bg-amber-400 hover:bg-amber-300 text-lime-950 font-bold rounded-xl px-6 h-11 gap-2 shadow-sm">
                Daftar PAUD Sekarang <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                "Assalamu'alaikum Admin PSB, saya ingin bertanya informasi pendaftaran PAUD Bali Bina Insani."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/40 font-semibold rounded-xl px-5 h-11 gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi Panitia
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


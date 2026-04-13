import { getSiteSettings } from "@/lib/data-fetching";
import Link from "next/link";
import Image from "next/image";
import { Download, ArrowRight, CheckCircle2, Share2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/public/ShareButtons";

export const metadata = {
  title: "Download Brosur PSB | Pondok Pesantren Bali Bina Insani",
  description:
    "Unduh brosur penerimaan santri baru (PSB) Pondok Pesantren Bali Bina Insani. Dapatkan informasi lengkap program, fasilitas, dan cara pendaftaran.",
  openGraph: {
    title: "Download Brosur PSB | Pondok Pesantren Bali Bina Insani",
    description: "Unduh brosur penerimaan santri baru (PSB) Pondok Pesantren Bali Bina Insani. Dapatkan informasi lengkap program, fasilitas, dan cara pendaftaran.",
    url: "https://project-98lnv.vercel.app/brosur",
    type: "website" as const,
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Download Brosur PSB | Pondok Pesantren Bali Bina Insani",
  },
};

const highlights = [
  "Program Tahfidz Al-Qur'an intensif",
  "Kajian Kitab Kuning klasik & kontemporer",
  "Tahassus Bahasa Arab, Inggris & Jepang",
  "Fasilitas modern & lingkungan kondusif",
  "Kurikulum nasional + kepesantrenan",
  "Pembinaan karakter Islami setiap hari",
];

export default async function BrosurPage() {
  const settings = await getSiteSettings();
  const schoolName = settings?.namaWeb || "Pondok Pesantren Bali Bina Insani";
  const brosurUrl = settings?.brosurUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      {/* Hero section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-100/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left: Text Content */}
            <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">


              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight">
                Unduh Brosur{" "}
                <span className="text-[#1A4D2E]">
                  {schoolName}
                </span>
              </h1>

              <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed">
                Temukan semua informasi yang Anda butuhkan tentang program pendidikan, fasilitas, biaya, dan prosedur pendaftaran dalam satu dokumen lengkap.
              </p>

              {/* Highlight list */}
              <ul className="space-y-2.5">
                {highlights.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {brosurUrl ? (
                  <a href={brosurUrl} target="_blank" rel="noopener noreferrer" download>
                    <Button
                      id="btn-download-brosur"
                      className="bg-[#1A4D2E] hover:bg-[#2D7A4F] text-white font-medium px-5 py-3.5 md:px-7 md:py-4 rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 text-sm md:text-base w-full sm:w-auto"
                    >
                      <Download className="w-5 h-5" />
                      Download Brosur PDF
                    </Button>
                  </a>
                ) : (
                  <div className="bg-slate-100 text-slate-400 font-medium px-5 py-3.5 md:px-7 md:py-4 rounded-xl flex items-center justify-center gap-2.5 text-sm md:text-base border border-slate-200 w-full sm:w-auto">
                    <FileText className="w-4 h-4" />
                    Brosur belum tersedia
                  </div>
                )}

                <Link href="/ppdb">
                  <Button
                    id="btn-daftar-sekarang"
                    variant="outline"
                    className="border border-[#1A4D2E] text-[#1A4D2E] font-medium px-5 py-3.5 md:px-7 md:py-4 rounded-xl hover:bg-[#1A4D2E] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto"
                  >
                    Daftar Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Share section */}
              <div className="pt-2">
                <ShareButtons title={`Download Brosur ${schoolName}`} url="/brosur" />
              </div>
            </div>

            {/* Right: Clean Brosur Card */}
            <div className="flex justify-center animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="relative w-full max-w-[300px]">
                {/* Subtle stacked shadow */}
                <div className="absolute -right-3 -bottom-3 w-full h-full bg-green-100/70 rounded-2xl" />
                <div className="absolute -right-1.5 -bottom-1.5 w-full h-full bg-green-200/50 rounded-2xl" />

                {/* Main card — fully clickable */}
                <a
                  href={brosurUrl ?? "#"}
                  target={brosurUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="relative block bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Cover image */}
                  <div className="relative w-full h-[320px] bg-slate-100">
                    {settings?.heroImageUrl ? (
                      <Image
                        src={settings.heroImageUrl}
                        alt={`Cover Brosur ${schoolName}`}
                        fill
                        className="object-cover"
                        sizes="300px"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300">
                        <FileText className="w-14 h-14" />
                        <p className="text-xs font-medium tracking-wide">Brosur belum tersedia</p>
                      </div>
                    )}
                    {/* Overlay gradient at bottom for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Card info footer */}
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{schoolName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Kabupaten Tabanan, Bali</p>
                    </div>
                    {brosurUrl && (
                      <div className="w-10 h-10 bg-[#1A4D2E] rounded-xl flex items-center justify-center shadow-md shrink-0">
                        <Download className="w-4.5 h-4.5 text-white" />
                      </div>
                    )}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 leading-tight">
            Siap bergabung bersama kami?
          </h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Setelah membaca brosur, langsung daftarkan putra/putri Anda melalui formulir pendaftaran online kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ppdb">
              <Button
                id="btn-ppdb-dari-brosur"
                className="bg-[#1A4D2E] hover:bg-[#2D7A4F] text-white font-medium px-5 py-3.5 rounded-xl shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto"
              >
                Formulir Pendaftaran
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/kontak">
              <Button
                id="btn-kontak-dari-brosur"
                variant="outline"
                className="border border-[#1A4D2E] text-[#1A4D2E] font-medium px-5 py-3.5 rounded-xl hover:bg-[#1A4D2E] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto"
              >
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { getGaleriList } from "@/lib/data-fetching";
import { GaleriClient } from "@/components/public/GaleriClient";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 1800; // Cache for 30 minutes

export const metadata: Metadata = {
  title: "Galeri Foto | Pondok Pesantren Bali Bina Insani",
  description: "Dokumentasi visual kegiatan edukatif, keagamaan, dan prestasi santri di Pondok Pesantren Bali Bina Insani.",
  alternates: {
    canonical: "/galeri",
  },
  openGraph: {
    title: "Galeri Foto | Pondok Pesantren Bali Bina Insani",
    description: "Dokumentasi visual kegiatan edukatif, keagamaan, dan prestasi santri di Pondok Pesantren Bali Bina Insani.",
    url: "https://www.pesantrenbali.my.id/galeri",
    type: "website",
  },
};

export default async function GaleriPage() {
  const galeriData = await getGaleriList();

  return (
    <div className="bg-[#FAFBFB] min-h-screen py-8 md:py-14 font-sans text-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigasi */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs sm:text-sm text-slate-500 gap-2">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            Beranda
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400">Kegiatan</span>
          <span className="text-slate-300">/</span>
          <span className="text-emerald-800 font-semibold">Galeri Foto</span>
        </nav>

        {/* Header Judul Utama */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Galeri Foto
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Kumpulan dokumentasi momen berharga, aktivitas pembelajaran, dan prestasi santri di Pondok Pesantren Bali Bina Insani.
          </p>
        </header>

        {/* Galeri Client Component */}
        <GaleriClient items={galeriData} />

      </div>
    </div>
  );
}

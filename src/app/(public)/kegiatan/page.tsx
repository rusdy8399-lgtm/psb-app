import { getKegiatanList } from "@/lib/data-fetching";
import { KabarPesantrenClient } from "@/components/public/KabarPesantrenClient";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 1800; // Cache for 30 minutes

export const metadata: Metadata = {
  title: "Kabar Pesantren | Pondok Pesantren Bali Bina Insani",
  description: "Ikuti berbagai kabar berita terkini, agenda kegiatan, dan prestasi santri di Pondok Pesantren Bali Bina Insani.",
};

export default async function KegiatanPage() {
  const data = await getKegiatanList();

  return (
    <div className="bg-white min-h-screen py-8 md:py-14 font-sans text-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigasi */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs sm:text-sm text-slate-500 gap-2">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            Beranda
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400">Kegiatan</span>
          <span className="text-slate-300">/</span>
          <span className="text-emerald-800 font-semibold">Kabar Pesantren</span>
        </nav>

        {/* Kabar Pesantren Client (Search Bar + 3 Column News Grid) */}
        <KabarPesantrenClient initialData={data} />

      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Images, CalendarDays } from "lucide-react";

interface KegiatanItem {
  id: string;
  judul: string;
  deskripsi: string;
  fotoUrl: string | null;
  tanggal: string;
  slug?: string | null;
}

interface KabarPesantrenClientProps {
  initialData: KegiatanItem[];
}

function formatIndonesianDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function KabarPesantrenClient({ initialData }: KabarPesantrenClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery.trim().toLowerCase());
  };

  const filteredData = useMemo(() => {
    if (!submittedQuery) return initialData;
    return initialData.filter(
      (item) =>
        item.judul.toLowerCase().includes(submittedQuery) ||
        item.deskripsi.toLowerCase().includes(submittedQuery)
    );
  }, [initialData, submittedQuery]);

  return (
    <div>
      {/* ── Search Bar Section (Matching reference screenshot) ── */}
      <div className="max-w-3xl mx-auto mb-10 sm:mb-14">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 shadow-sm border border-slate-200/90 rounded-xl overflow-hidden bg-white">
          <div className="relative flex-1 flex items-center px-4 py-3 sm:py-3.5">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === "") setSubmittedQuery("");
              }}
              placeholder="Cari Berita Di sini"
              className="w-full text-sm sm:text-base text-slate-800 placeholder:text-slate-400 bg-transparent outline-none focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#1A4D2E] hover:bg-[#143d24] text-white px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center"
          >
            TELUSURI
          </button>
        </form>
      </div>

      {/* ── Judul Utama Halaman ── */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-extrabold text-slate-900 tracking-wider uppercase">
          KABAR PESANTREN
        </h1>
        <div className="w-16 h-1 bg-emerald-600 mx-auto mt-3 rounded-full" />
        <p className="text-xs sm:text-sm text-slate-500 mt-3 max-w-xl mx-auto">
          Informasi terkini seputar aktivitas pendidikan, pengumuman, dan prestasi santri Pondok Pesantren Bali Bina Insani.
        </p>
      </div>

      {/* ── 3 Column News Grid (Matching UMJ reference) ── */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {filteredData.map((item) => (
            <article key={item.id} className="group flex flex-col h-full bg-white">
              {/* Foto Thumbnail (Aspect 16:10) */}
              <Link
                href={`/kegiatan/${item.slug || item.id}`}
                className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 block shrink-0"
              >
                {item.fotoUrl ? (
                  <Image
                    src={item.fotoUrl}
                    alt={item.judul}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Images className="w-8 h-8" />
                  </div>
                )}
              </Link>

              {/* Konten Berita */}
              <div className="flex-1 flex flex-col pt-4">
                {/* Judul Berita */}
                <h2 className="text-base sm:text-[17px] font-heading font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                  <Link href={`/kegiatan/${item.slug || item.id}`}>
                    {item.judul}
                  </Link>
                </h2>

                {/* Tanggal Publikasi */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-sans">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatIndonesianDate(item.tanggal)}</span>
                </div>

                {/* Cuplikan Isi Berita */}
                <p className="text-xs sm:text-[13.5px] text-slate-600 leading-relaxed line-clamp-3 mt-2.5 font-sans">
                  {item.deskripsi}
                </p>

                {/* Tautan Selengkapnya » */}
                <div className="mt-3 pt-2">
                  <Link
                    href={`/kegiatan/${item.slug || item.id}`}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors inline-block"
                  >
                    Selengkapnya »
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
          <p className="text-slate-600 font-medium">
            Tidak ditemukan berita dengan kata kunci &quot;{submittedQuery}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSubmittedQuery("");
            }}
            className="mt-4 text-xs font-bold text-emerald-700 hover:underline"
          >
            Tampilkan semua berita
          </button>
        </div>
      )}
    </div>
  );
}

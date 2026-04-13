import { getKegiatanList, getGaleriList } from "@/lib/data-fetching";
import { CalendarDays, ArrowRight, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function KegiatanPage() {
  const [data, galeriData] = await Promise.all([
    getKegiatanList(),
    getGaleriList()
  ]);

  // Up to 8 items for the gallery from independent galeri table
  const galleryItems = galeriData.slice(0, 8);

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Galeri Kegiatan ─────────────────────────── */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 leading-tight">
              Momen Berharga Santri
            </h2>
            <p className="text-gray-500 text-sm md:text-base lg:text-lg mt-2 max-w-2xl mx-auto leading-relaxed">
              Dokumentasi kegiatan edukatif, keagamaan, dan prestasi santri Bali Bina Insani.
            </p>
          </div>

          {/* Photo Grid */}
          {galleryItems.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl overflow-hidden block group relative bg-slate-100 aspect-square image-shimmer"
                    title={item.judul}
                  >
                    <Image
                      src={item.fotoUrl!}
                      alt={item.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* Hover overlay with title */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-white text-xs font-medium line-clamp-2 leading-snug">
                        {item.judul}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6">
                <p className="text-xs text-gray-400">
                  Menampilkan {galleryItems.length} dari {galeriData.length} foto galeri
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <Images className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Belum ada foto kegiatan.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Daftar Berita & Kegiatan ─────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Aktivitas Santri <span className="text-primary">Terbaru</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mt-2">
              Ikuti berbagai kegiatan edukatif, keagamaan, dan prestasi santri di Pondok Pesantren Bali Bina Insani.
            </p>
          </div>

          {data.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((item, idx) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full animate-in fade-in zoom-in-95 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden image-shimmer">
                    <Image
                      src={item.fotoUrl}
                      alt={item.judul}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20">
                      {item.tanggal}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold font-sans text-slate-800 mb-4 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {item.judul}
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-sans">
                        {item.deskripsi}
                      </p>
                    </div>

                    <Link href={`/kegiatan/${item.id}`} className="inline-block pt-4 border-t border-slate-50 mt-auto">
                      <Button variant="ghost" className="p-0 h-auto font-bold text-primary group-hover:gap-3 transition-all flex items-center gap-2 text-sm bg-transparent hover:bg-transparent">
                        Baca Selengkapnya <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <CalendarDays className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-500 mb-2">Belum ada kegiatan untuk saat ini.</h3>
              <p className="text-slate-400">Hubungi admin melalui Dashboard untuk menambahkan kegiatan.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

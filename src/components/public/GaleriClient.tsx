"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, X, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface GaleriItem {
  id: string;
  judul: string;
  deskripsi: string | null;
  fotoUrl: string;
  tanggal: string;
}

interface GaleriClientProps {
  items: GaleriItem[];
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

export function GaleriClient({ items }: GaleriClientProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GaleriItem | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Current year for the album header
  const currentYear = items.length > 0 && items[0].tanggal
    ? new Date(items[0].tanggal).getFullYear() || 2026
    : 2026;

  return (
    <div>
      {/* ── Album Box Container (Matching reference style) ── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 md:p-10 transition-all">
        
        {/* Album Header Bar */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-5 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-800 tracking-tight">
              {currentYear}
            </h2>
            <p className="text-xs sm:text-[13px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              DOKUMENTASI KEGIATAN & PRESTASI SANTRI
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Buka / Tutup Album"
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Dense Photo Grid (5-6 Columns Desktop, 2-3 Mobile) */}
        {isExpanded && (
          <>
            {items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
                {items.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedPhoto(photo);
                      }
                    }}
                    className="group relative aspect-[4/3] rounded-md overflow-hidden bg-slate-100 border border-slate-200/70 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-emerald-300"
                    title={photo.judul}
                  >
                    {photo.fotoUrl ? (
                      <Image
                        src={photo.fotoUrl}
                        alt={photo.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Images className="w-6 h-6" />
                      </div>
                    )}

                    {/* Subtle Hover Gradient & Title Indicator */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2 pointer-events-none">
                      <p className="text-white text-[11px] font-medium line-clamp-2 leading-tight">
                        {photo.judul}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <Images className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-medium">Belum ada foto dalam galeri saat ini.</p>
              </div>
            )}
          </>
        )}
      </div>

        {/* ── Photo Lightbox Modal ── */}
        <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none rounded-2xl shadow-2xl">
            <DialogTitle className="sr-only">
              {selectedPhoto?.judul || "Foto Galeri"}
            </DialogTitle>

            {selectedPhoto && (
              <div className="relative flex flex-col">
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative w-full h-[55vh] sm:h-[70vh] bg-black flex items-center justify-center">
                  <Image
                    src={selectedPhoto.fotoUrl}
                    alt={selectedPhoto.judul}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    priority
                  />
                </div>

                <div className="p-4 sm:p-6 bg-slate-900 text-white border-t border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-sans">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{formatIndonesianDate(selectedPhoto.tanggal)}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-sans text-white leading-snug">
                    {selectedPhoto.judul}
                  </h3>
                  {selectedPhoto.deskripsi && (
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      {selectedPhoto.deskripsi}
                    </p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
}

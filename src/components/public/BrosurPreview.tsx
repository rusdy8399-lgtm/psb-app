"use client";

import { useState, useEffect } from "react";
import { FileText, ExternalLink, Loader2 } from "lucide-react";

interface BrosurPreviewProps {
  url?: string | null;
  schoolName: string;
}

export function BrosurPreview({ url, schoolName }: BrosurPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || "";
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const noPdfSupport = "pdfViewerEnabled" in navigator && !navigator.pdfViewerEnabled;

      // On mobile devices or browsers without built-in PDF viewer, show alternative viewer fallback
      if (isMobileDevice || noPdfSupport) {
        setIsFallback(true);
        setIsLoading(false);
        return;
      }

      // Check if URL can be reached or if network/TLS/CORS blocks inline preview
      fetch(url, { mode: "no-cors" })
        .then(() => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setIsFallback(true);
            setIsLoading(false);
          }
        });
    }

    // Safety timeout: if iframe takes too long to load or hangs
    const timer = setTimeout(() => {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [url]);

  // Kondisi 1: URL Brosur belum tersedia
  if (!url) {
    return (
      <div className="relative w-full h-[340px] bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-300 p-6">
        <FileText className="w-14 h-14 text-slate-300" />
        <p className="text-xs font-medium tracking-wide text-slate-400">Brosur belum tersedia</p>
      </div>
    );
  }

  // Kondisi 2: Preview gagal dimuat atau perangkat tidak mendukung preview inline PDF (mobile/browser terbatas)
  if (isFallback) {
    return (
      <div className="relative w-full h-[340px] bg-slate-50/80 flex flex-col items-center justify-center gap-3.5 text-center p-6 border-b border-slate-100">
        <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-200/60 flex items-center justify-center text-[#1A4D2E] shadow-sm">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">Preview Brosur</p>
          <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed">
            Preview tidak dapat ditampilkan langsung di perangkat ini. Silakan buka brosur lengkap melalui tombol di bawah.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A4D2E] hover:bg-[#2D7A4F] text-white text-xs font-medium rounded-xl shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all mt-1"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Lihat Brosur
        </a>
      </div>
    );
  }

  // Kondisi 3: Tampilan Preview PDF via iframe responsif
  return (
    <div className="relative w-full h-[340px] bg-slate-100 overflow-hidden group">
      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#1A4D2E]" />
          <span className="text-xs text-slate-500 font-medium">Memuat preview brosur...</span>
        </div>
      )}

      {/* Tombol alternatif 'Lihat Brosur' di sudut preview untuk membuka di tab baru */}
      <div className="absolute top-2.5 right-2.5 z-20 opacity-90 hover:opacity-100 transition-opacity">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[11px] font-medium rounded-lg shadow-sm transition-all hover:scale-105"
          title="Buka brosur di tab baru"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Lihat Brosur</span>
        </a>
      </div>

      {/* Elemen PDF Iframe responsif */}
      <iframe
        src={`${url}#toolbar=0&navpanes=0&view=FitH`}
        title={`Preview Brosur ${schoolName}`}
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsFallback(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}

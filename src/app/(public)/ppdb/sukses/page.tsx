"use client";

import Link from "next/link";
import { CheckCircle, Copy, Download, Home, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";
import { generateCertificate, CertificateData } from "@/lib/pdf/CertificateGenerator";

function SuksesPageContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "REG-UNKNOWN";
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/ppdb/status?code=${code}`);
        if (res.ok) {
          const result = await res.json();
          setData({
            id: result.id,
            namaLengkap: result.namaLengkap,
            kodePendaftaran: result.kodePendaftaran,
            jenjang: result.jenjang,
            tempatLahir: result.tempatLahir,
            tanggalLahir: result.tanggalLahir,
            nisn: result.nisn,
            nik: result.nik,
            asalSekolah: result.asalSekolah,
            pasFotoUrl: result.pasFotoUrl,
            tanggalDaftar: new Date(result.createdAt).toLocaleDateString('id-ID'),
            tahunAjaran: result.heroBadge,
          });
        }
      } catch (error) {
        console.error("Error fetching success data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (code !== "REG-UNKNOWN") {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [code]);

  const handleDownload = async () => {
    if (!data) {
      toast.error("Data pendaftaran tidak tersedia untuk diunduh.");
      return;
    }
    toast.success("Sedang mengunduh surat keterangan...");
    try {
      await generateCertificate(data);
    } catch(err) {
      toast.error("Gagal membuat PDF");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Kode pendaftaran berhasil disalin!");
  };

  return (
    <div className="bg-background min-h-[80vh] py-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-2xl relative overflow-hidden transition-all hover:shadow-primary/5">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary-light to-gold"></div>
          
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-in zoom-in duration-500">
            <CheckCircle className="w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Pendaftaran Berhasil!</h1>
          <p className="text-muted-foreground mb-8">
            Terima kasih, data pendaftaran Anda telah kami terima dan sedang dalam antrean verifikasi oleh Panitia PPDB.
          </p>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 shadow-sm">
            <p className="text-[10px] text-primary/60 font-black uppercase tracking-[0.2em] mb-3">Kode Pendaftaran Anda</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl md:text-5xl font-mono font-bold tracking-[0.3em] text-primary">{code}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-5">
              Simpan kode ini baik-baik. Gunakan kode ini untuk mengecek status dan verifikasi lapangan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <Button 
                onClick={copyCode}
                variant="outline" 
                className="h-12 border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 w-full font-bold"
            >
              <Copy className="w-4 h-4" /> Salin Kode
            </Button>
            <Button 
                onClick={handleDownload}
                disabled={loading || !data}
                className="h-12 bg-gold hover:bg-gold-dark text-white gap-2 w-full font-bold shadow-lg shadow-gold/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} 
              Surat Keterangan (PDF)
            </Button>
          </div>

          <div className="text-left bg-primary/5 rounded-2xl p-6 mb-8 text-[13px] text-slate-600 border border-primary/10">
            <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Langkah Selanjutnya:
            </h4>
            <ol className="list-decimal list-outside ml-4 space-y-2.5">
              <li>Panitia akan memverifikasi berkas Anda dalam 1-2 hari kerja.</li>
              <li><span className="font-bold text-primary">PENTING:</span> Harap membawa dokumen fisik (KK, Akta, Ijazah) asli & fotokopi saat verifikasi lapangan.</li>
              <li>Pantau terus website dan grup WhatsApp calon santri untuk jadwal tes seleksi.</li>
            </ol>
          </div>

          <Link href="/">
            <Button className="w-full h-14 bg-primary hover:bg-[#133d24] text-white font-black rounded-xl gap-2 text-base transition-transform active:scale-95 shadow-xl shadow-primary/20">
              <Home className="w-5 h-5" /> KEMBALI KE BERANDA
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PPDBSuksesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <SuksesPageContent />
    </Suspense>
  );
}

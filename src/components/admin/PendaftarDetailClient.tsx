"use client";

import React, { useState } from "react";
import {
  ArrowLeft, CheckCircle, FileText, User, Users, MapPin,
  Phone, Mail, Fingerprint, Calendar, Wallet, Download, ExternalLink,
  ShieldCheck, AlertCircle, FolderOpen, CheckCircle2, Trash2, CreditCard,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateCertificate } from "@/lib/pdf/CertificateGenerator";

interface PendaftarDetailProps {
  pendaftar: any;
  ortu: any;
  berkas: any;
  settings?: any;
}

export function PendaftarDetailClient({ pendaftar, ortu, berkas, settings }: PendaftarDetailProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(pendaftar?.status);

  if (!pendaftar) {
    return (
      <div className="p-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <p className="text-slate-500 font-bold">Data pendaftar tidak ditemukan.</p>
      </div>
    );
  }

  const handleKonfirmasi = async () => {
    setIsConfirming(true);
    try {
      const response = await fetch(`/api/admin/pendaftar/${pendaftar.id}/verify`, {
        method: "POST",
      });

      if (response.ok) {
        setCurrentStatus("Terkonfirmasi");
        toast.success("Pendaftaran berhasil dikonfirmasi!");
        router.refresh();
      } else {
        toast.error("Gagal melakukan konfirmasi.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDownloadCertificate = async () => {
    toast.success("Mengunduh surat keterangan...");
    try {
      await generateCertificate({
        id: pendaftar.id,
        namaLengkap: pendaftar.namaLengkap,
        kodePendaftaran: pendaftar.kodePendaftaran,
        jenjang: pendaftar.jenjang,
        tempatLahir: pendaftar.tempatLahir,
        tanggalLahir: pendaftar.tanggalLahir,
        nisn: pendaftar.nisn,
        nik: pendaftar.nik,
        asalSekolah: pendaftar.asalSekolah,
        pasFotoUrl: berkas?.pasFotoUrl,
        tanggalDaftar: new Date(pendaftar.createdAt).toLocaleDateString('id-ID'),
        tahunAjaran: settings?.heroBadge,
      });
    } catch (e) {
      toast.error("Gagal membuat PDF");
    }
  };

  const handleSendEmail = async () => {
    toast.promise(
      (async () => {
        const response = await fetch(`/api/admin/pendaftar/${pendaftar.id}/send-email`, { method: "POST" });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Gagal mengirim email");
        }
        return response;
      })(),
      {
        loading: 'Mengirim email...',
        success: 'Email berhasil dikirim ke pendaftar!',
        error: (err: any) => err.message || 'Gagal mengirim email. Pastikan API Key sudah terpasang.',
      }
    );
  };

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pendaftaran ini secara permanen? Seluruh berkas di Firebase juga akan dihapus.")) {
      return;
    }

    toast.promise(
      (async () => {
        const response = await fetch(`/api/admin/pendaftar/${pendaftar.id}`, { method: "DELETE" });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Gagal menghapus pendaftaran");
        }
        return response;
      })(),
      {
        loading: 'Menghapus pendaftaran...',
        success: () => {
          router.push("/dashboard/pendaftar");
          return 'Pendaftaran berhasil dihapus!';
        },
        error: (err: any) => err.message || 'Gagal menghapus data.',
      }
    );
  };

  // --- UI Render Helpers ---
  
  const renderDataField = (label: string, value: string | number | null, Icon?: React.ElementType) => (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-300" />}
        <span className="text-sm font-semibold text-gray-900 leading-tight">
          {value || "-"}
        </span>
      </div>
    </div>
  );

  const renderFileRow = (label: string, url: string | null) => (
    <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-lg border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md ${url ? 'bg-indigo-50 text-indigo-500' : 'bg-gray-100 text-gray-300'}`}>
          <FileText className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-700">{label}</span>
          <span className="text-[10px] text-gray-400 italic">
            {url ? "Berkas Digital" : "Belum diunggah"}
          </span>
        </div>
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-indigo-500 hover:bg-indigo-50">
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </a>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 p-2 md:p-4 animate-in fade-in duration-500">
      
      {/* 1. Header SaaS-Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-5">
          <Link href="/dashboard/pendaftar">
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
              <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-bold text-gray-900 tracking-tight">Detail Pendaftar</h1>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  currentStatus === "Terkonfirmasi" 
                    ? "bg-green-100/80 text-green-600 border border-green-200" 
                    : "bg-amber-100/80 text-amber-600 border border-amber-200"
                }`}>
                  {currentStatus}
                </span>
                {pendaftar.confirmedAt && (
                   <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                      <Sparkles className="w-3 h-3" /> AUTO-VERIFIED
                   </div>
                )}
              </div>
            </div>
            <p className="text-xs font-medium text-gray-400">
              ID Registrasi: <span className="text-indigo-500 font-mono font-bold tracking-tight">{pendaftar.kodePendaftaran}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadCertificate}
            variant="outline"
            className="h-10 px-4 rounded-xl border-gray-200 text-gray-600 font-semibold text-xs gap-2 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> Cetak Surat
          </Button>
          <Button
            onClick={handleSendEmail}
            variant="outline"
            className="h-10 px-4 rounded-xl border-gray-200 text-gray-600 font-semibold text-xs gap-2 hover:bg-gray-50"
          >
            <Mail className="w-4 h-4" /> Kirim Email
          </Button>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Core Data (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section A: Data Diri */}
          <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                <User className="w-4 h-4 text-indigo-500" /> Data Diri Santri
              </h2>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {renderDataField("Nama Lengkap", pendaftar.namaLengkap.toUpperCase())}
                {renderDataField("Pilihan Jenjang", pendaftar.jenjang)}
                {renderDataField("Tempat, Tanggal Lahir", `${pendaftar.tempatLahir}, ${pendaftar.tanggalLahir}`, Calendar)}
                {renderDataField("Jenis Kelamin", pendaftar.jenisKelamin)}
                {renderDataField("NISN", pendaftar.nisn, Fingerprint)}
                {renderDataField("NIK", pendaftar.nik || pendaftar.noKk)}
                {renderDataField("Asal Sekolah", pendaftar.asalSekolah)}
                <div className="grid grid-cols-2 gap-4">
                  {renderDataField("Anak Ke-", pendaftar.anakKe)}
                  {renderDataField("Jml Saudara", pendaftar.jumlahSaudara)}
                </div>
                <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-50">
                  {renderDataField("Alamat Lengkap", pendaftar.alamat, MapPin)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section B: Data Orang Tua */}
          <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
             <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                <Users className="w-4 h-4 text-indigo-500" /> Data Orang Tua / Wali
              </h2>
            </div>
            <CardContent className="p-6">
              {ortu ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {renderDataField("Nama Ayah", ortu.namaAyah)}
                    {renderDataField("Pekerjaan Ayah", ortu.pekerjaanAyah)}
                    {renderDataField("Nama Ibu", ortu.namaIbu)}
                    {renderDataField("Pekerjaan Ibu", ortu.pekerjaanIbu || "-")}
                    <div className="md:col-span-2">
                       {renderDataField("Penghasilan Ayah/Wali", ortu.penghasilanAyah, Wallet)}
                    </div>
                    {renderDataField("Konten Darurat (WA)", ortu.noHpWali, Phone)}
                    {renderDataField("Alamat Orang Tua", ortu.alamatOrtu)}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-xs">
                  Informasi orang tua belum dilengkapi.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Support Data (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section C: Administrasi */}
          <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                <FolderOpen className="w-4 h-4 text-indigo-500" /> Berkas Digital
              </h2>
            </div>
            <CardContent className="p-5 space-y-3">
              {berkas ? (
                <>
                  {renderFileRow("Kartu Keluarga (KK)", berkas.kkUrl)}
                  {renderFileRow("Akta Kelahiran", berkas.aktaKelahiranUrl)}
                  {renderFileRow("Ijazah Terakhir", berkas.ijazahUrl)}
                  {renderFileRow("Pas Foto 3x4", berkas.pasFotoUrl)}
                </>
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs italic">Belum ada dokumen diproses.</div>
              )}
            </CardContent>
          </Card>

          {/* Section D: Pembayaran */}
          <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                <CreditCard className="w-4 h-4 text-indigo-500" /> Konfirmasi Pembayaran
              </h2>
            </div>
            <CardContent className="p-5 space-y-5">
              {berkas ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                     {renderDataField("Pengirim", berkas.namaPengirim)}
                     {renderDataField("Tgl Bayar", berkas.tanggalTransfer)}
                  </div>
                  <div className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-video bg-gray-50 flex items-center justify-center">
                    {berkas.buktiPembayaranUrl ? (
                      <div className="w-full h-full relative">
                        <img 
                          src={berkas.buktiPembayaranUrl} 
                          alt="Bukti Transfer" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'flex flex-col items-center justify-center h-full text-gray-300 gap-2';
                              fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off w-8 h-8"><line x1="2" y1="2" x2="22" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.82-2.82"/><line x1="10" y1="14" x2="10.01" y2="14"/><path d="M13.5 13.5 15 15"/><path d="M16 11.23a2 2 0 0 1-2.23 2.23"/><path d="M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h13"/><path d="M21 16V5a2 2 0 0 0-2-2"/></svg><span class="text-[10px] font-bold uppercase">File tidak ditemukan</span>';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                        <a href={berkas.buktiPembayaranUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <Button variant="secondary" size="sm" className="font-bold text-xs gap-2">
                             Preview <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      </div>
                    ) : (
                      <AlertCircle className="w-8 h-8 text-gray-200" />
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs italic">Menunggu bukti transfer...</div>
              )}
            </CardContent>
          </Card>

          {/* Section E: Actions */}
          <div className="space-y-4">
            {currentStatus !== "Terkonfirmasi" ? (
              <Button
                onClick={handleKonfirmasi}
                disabled={isConfirming}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl transition-all flex items-center gap-2 justify-center shadow-md shadow-indigo-100 border-none"
              >
                {isConfirming ? "Memproses..." : <><CheckCircle2 className="w-5 h-5" /> Terima Pendaftaran</>}
              </Button>
            ) : (
              <div className="w-full py-3.5 rounded-xl border border-green-200 bg-green-50 flex items-center justify-center gap-2 text-green-700 text-xs font-black uppercase tracking-widest shadow-sm shadow-green-50">
                <ShieldCheck className="w-4 h-4" /> Terverifikasi Final
              </div>
            )}

            <Button
              onClick={handleDelete}
              variant="ghost"
              className="w-full text-gray-400 hover:text-red-500 hover:bg-red-50 text-[11px] font-bold uppercase tracking-widest h-10 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Abaikan / Hapus Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

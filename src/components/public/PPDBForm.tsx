"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard, UploadCloud, CheckCircle2, AlertCircle,
  User, Users, FolderOpen, ShieldCheck, ChevronRight, ChevronLeft,
  FileText, Camera, Wallet, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PPDBFormProps {
  settings: {
    infoRekening?: string | null;
    biayaRegistrasi?: string | null;
    heroBadge?: string | null;
  } | null;
}

export function PPDBForm({ settings }: PPDBFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Select Jenjang, 1: A, 2: B, 3: C, 4: D
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    jenjang: "",
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    email: "",
    alamat: "",
    nik: "",
    nisn: "",
    noKk: "",
    asalSekolah: "",
    anakKe: "",
    jumlahSaudara: "",

    namaAyah: "",
    pekerjaanAyah: "",
    penghasilanAyah: "",
    namaIbu: "",
    pekerjaanIbu: "",
    noHpWali: "",

    namaPengirim: "",
    tanggalTransfer: "",
    pernyataanCorrect: false,
  });

  // File State
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    fileKK: null,
    fileAkta: null,
    fileIjazah: null,
    fileFoto: null,
    fileBukti: null,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const validateStep = () => {
    if (step === 0 && !formData.jenjang) return "Pilih jenjang pendidikan";
    if (step === 1) {
      if (!formData.namaLengkap) return "Nama Lengkap wajib diisi";
      if (!formData.tempatLahir || !formData.tanggalLahir) return "Tempat & Tanggal Lahir wajib diisi";
      if (!formData.jenisKelamin) return "Pilih jenis kelamin";
      if (!formData.nisn) return "NISN wajib diisi";
      if (!formData.asalSekolah) return "Asal Sekolah wajib diisi";
      if (!formData.alamat) return "Alamat wajib diisi";
    }
    if (step === 2) {
      if (!formData.namaAyah) return "Nama Ayah wajib diisi";
      if (!formData.pekerjaanAyah) return "Pekerjaan Ayah wajib diisi";
      if (!formData.penghasilanAyah) return "Penghasilan Ayah wajib diisi";
      if (!formData.namaIbu) return "Nama Ibu wajib diisi";
      if (!formData.noHpWali) return "Nomor HP/WA Wali wajib diisi";
      // Basic WA validation
      if (!/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(formData.noHpWali)) return "Format nomor WhatsApp tidak valid";
    }
    if (step === 3) {
      if (!formData.noKk) return "Nomor Kartu Keluarga wajib diisi";
      // Document files are now optional for faster registration
    }
    if (step === 4) {
      if (!formData.namaPengirim) return "Nama Pengirim wajib diisi";
      if (!formData.tanggalTransfer) return "Tanggal Transfer wajib diisi";
      if (!files.fileBukti) return "Unggah Bukti Transfer";
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep();
    if (error) {
      toast.error(error);
      return;
    }
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      jenjang: "",
      namaLengkap: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "",
      email: "",
      alamat: "",
      nik: "",
      nisn: "",
      noKk: "",
      asalSekolah: "",
      anakKe: "",
      jumlahSaudara: "",
      namaAyah: "",
      pekerjaanAyah: "",
      penghasilanAyah: "",
      namaIbu: "",
      pekerjaanIbu: "",
      noHpWali: "",
      namaPengirim: "",
      tanggalTransfer: "",
      pernyataanCorrect: false,
    });
    setFiles({
      fileKK: null,
      fileAkta: null,
      fileIjazah: null,
      fileFoto: null,
      fileBukti: null,
    });
    setStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info("Formulir telah dikosongkan");
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!formData.pernyataanCorrect) {
      toast.error("Anda harus menyetujui pernyataan kebenaran data.");
      return;
    }

    setIsSubmitting(true);
    const submissionData = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value.toString());
    });

    // Append all files
    Object.entries(files).forEach(([key, file]) => {
      if (file) submissionData.append(key, file);
    });

    // Append verification flag
    submissionData.append("paymentAutoVerified", "false");

    try {
      const response = await fetch("/api/ppdb", {
        method: "POST",
        body: submissionData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Pendaftaran Berhasil Terkirim!");
        router.push(`/ppdb/sukses?code=${data.kodePendaftaran}`);
      } else {
        const errData: any = await response.json();
        console.error("ERROR API DETAIL:", errData);
        const errorMessage = errData.error || "Gagal mengirim pendaftaran.";
        const errorDetail = errData.details ? `: ${errData.details}` : "";
        const finalError = `${errorMessage}${errorDetail}`;
        setFormError(finalError);
        toast.error(finalError);
      }
    } catch (error: any) {
      setFormError("Terjadi kesalahan koneksi. Silakan coba lagi.");
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const biaya = settings?.biayaRegistrasi || "200.000";
  const rekening = settings?.infoRekening || "BRI: 0573010001017300 a.n. PSB Bali Bina Insani";

  const renderStepIcon = (num: number, Icon: React.ElementType, label: string) => {
    const isActive = step === num;
    const isCompleted = step > num;
    return (
      <div key={num} className={`flex flex-col items-center gap-1.5 ${isActive || isCompleted ? 'text-primary' : 'text-slate-300'}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-primary text-white border-primary shadow-md ring-4 ring-primary/5' :
          isCompleted ? 'bg-primary/5 border-primary text-primary' : 'bg-slate-50 border-slate-200'
          }`}>
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
        </div>
        <span className={`hidden md:block text-[9px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 max-w-[850px] font-heading py-8">
      {/* Header Info */}
      <div className="text-center mb-5 md:mb-8 mt-4 md:mt-0">
        <span className="badge-gold-elegan text-[10px] py-1 px-3">{settings?.heroBadge || "PENERIMAAN SANTRI BARU"}</span>
        <h1 className="text-[24px] md:text-3xl font-bold text-primary mt-3 tracking-tight leading-[1.2]">Formulir Pendaftaran Online</h1>
        <p className="text-slate-500 mt-2 text-[14px] max-w-[90%] md:max-w-lg mx-auto leading-relaxed">Silakan lengkapi data calon santri sesuai dengan dokumen resmi untuk mempermudah proses verifikasi.</p>
      </div>

      {/* Progress Tracker */}
      {step > 0 && (
        <div className="mb-8 flex items-center justify-between relative max-w-xl mx-auto">
          <div className="absolute top-4.5 left-0 right-0 h-0.5 bg-slate-100 -z-10" />
          <div className="absolute top-4.5 left-0 right-0 h-0.5 bg-primary transition-all duration-1000 -z-10" style={{ width: `${(step - 1) * 33.33}%` }} />

          {renderStepIcon(1, User, "Santri")}
          {renderStepIcon(2, Users, "Orang Tua")}
          {renderStepIcon(3, FolderOpen, "Dokumen")}
          {renderStepIcon(4, ShieldCheck, "Selesai")}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} className="space-y-6">

        {/* STEP 0: LEVEL SELECTION */}
        {step === 0 && (
          <div className="bg-white p-5 md:p-10 rounded-[16px] border border-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)] text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Pilih Jenjang Sekolah</h3>
            <p className="text-sm text-slate-500 mb-6">Pilih jenjang pendidikan yang ingin Anda daftarkan.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => handleInputChange("jenjang", "MTs")}
                className={`p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 ${formData.jenjang === "MTs" ? "border-[#166534] bg-[#F0FDF4] shadow-sm scale-95" : "border-[#E5E7EB] hover:border-[#166534]/50 hover:bg-[#F0FDF4]/30"
                  }`}
              >
                <span className="text-2xl font-black text-primary">MTs</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">MTS (SMP)</span>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("jenjang", "MA")}
                className={`p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 ${formData.jenjang === "MA" ? "border-[#166534] bg-[#F0FDF4] shadow-sm scale-95" : "border-[#E5E7EB] hover:border-[#166534]/50 hover:bg-[#F0FDF4]/30"
                  }`}
              >
                <span className="text-2xl font-black text-primary">MA</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">MA (SMA)</span>
              </button>
            </div>

            <div className="mt-6 md:mt-8 flex justify-center">
              <Button
                type="button"
                onClick={nextStep}
                disabled={!formData.jenjang}
                className={`bg-[#166534] hover:bg-[#133d24] w-full md:w-auto h-[52px] px-10 text-white rounded-xl font-semibold text-[16px] group shadow-sm transition-all duration-200 ${!formData.jenjang ? "opacity-50" : ""}`}
              >
                Mulai Pendaftaran <ChevronRight className="w-5 h-5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 1: PART A - DATA SANTRI */}
        {step === 1 && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-lg shadow-primary/5 animate-in slide-in-from-right-8 duration-500">
            <h3 className="text-base font-bold text-primary mb-6 flex items-center gap-2.5 border-b border-primary/5 pb-3.5">
              <span className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center"><User className="w-3.5 h-3.5" /></span>
              Bagian A: Data Calon Santri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Nama Lengkap <span className="text-destructive">*</span></Label>
                <Input value={formData.namaLengkap} onChange={e => handleInputChange("namaLengkap", e.target.value)} placeholder="Contoh: Akhmad Maulana" required className="h-10 rounded-lg focus:ring-primary shadow-sm text-sm font-normal" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tempat Lahir <span className="text-destructive">*</span></Label>
                  <Input value={formData.tempatLahir} onChange={e => handleInputChange("tempatLahir", e.target.value)} required className="h-10 rounded-lg text-sm font-normal" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tgl Lahir <span className="text-destructive">*</span></Label>
                  <Input type="date" value={formData.tanggalLahir} onChange={e => handleInputChange("tanggalLahir", e.target.value)} required className="h-10 rounded-lg text-sm font-normal" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Jenis Kelamin <span className="text-destructive">*</span></Label>
                <Select required onValueChange={(v) => handleInputChange("jenisKelamin", v || "")} value={formData.jenisKelamin}>
                  <SelectTrigger className="h-10 rounded-lg text-sm font-normal">
                    <SelectValue placeholder="Pilih L/P" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">NISN <span className="text-destructive">*</span></Label>
                <Input value={formData.nisn} onChange={e => handleInputChange("nisn", e.target.value)} placeholder="10 digit NISN" required className="h-10 rounded-lg text-sm font-normal" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">NIK <span className="text-slate-300">(Opsional)</span></Label>
                <Input value={formData.nik} onChange={e => handleInputChange("nik", e.target.value)} placeholder="Sesuai KK" className="h-10 rounded-lg text-sm font-normal" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Asal Sekolah <span className="text-destructive">*</span></Label>
                <Input value={formData.asalSekolah} onChange={e => handleInputChange("asalSekolah", e.target.value)} placeholder="Nama Sekolah Sebelumnya" required className="h-10 rounded-lg text-sm font-normal" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Anak Ke- <span className="text-slate-300">(Opt)</span></Label>
                  <Input type="number" value={formData.anakKe} onChange={e => handleInputChange("anakKe", e.target.value)} className="h-10 rounded-lg text-sm font-normal" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Jml Saudara <span className="text-slate-300">(Opt)</span></Label>
                  <Input type="number" value={formData.jumlahSaudara} onChange={e => handleInputChange("jumlahSaudara", e.target.value)} className="h-10 rounded-lg text-sm font-normal" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Alamat Lengkap <span className="text-destructive">*</span></Label>
                <textarea
                  required
                  value={formData.alamat}
                  onChange={e => handleInputChange("alamat", e.target.value)}
                  className="flex min-h-[70px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-normal"
                  placeholder="Gunakan Alamat di Kartu Keluarga (Jalan, RT/RW, Desa, Kec, Kab)"
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-5 border-t border-slate-50">
              <button type="button" onClick={prevStep} className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 font-semibold uppercase text-[10px]">
                <ChevronLeft className="w-3.5 h-3.5" /> Kembali
              </button>
              <Button type="button" onClick={nextStep} className="bg-primary px-7 h-10 rounded-lg font-bold text-[13px]">
                Selanjutnya <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PART B - ORANG TUA/WALI */}
        {step === 2 && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-lg shadow-primary/5 animate-in slide-in-from-right-8 duration-500">
            <h3 className="text-base font-bold text-primary mb-6 flex items-center gap-2.5 border-b border-primary/5 pb-3.5">
              <span className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center"><Users className="w-3.5 h-3.5" /></span>
              Bagian B: Data Orang Tua / Wali
            </h3>

            <div className="space-y-6">
              {/* Data Ayah */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-5 md:p-6 rounded-xl border border-slate-100/60 bg-slate-50/30">
                <h4 className="md:col-span-2 font-bold text-[10px] text-primary/50 uppercase tracking-[0.1em] flex items-center gap-1.5 mb-0.5">
                  Data Ayah Kandung
                </h4>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Nama Ayah <span className="text-destructive">*</span></Label>
                  <Input value={formData.namaAyah} onChange={e => handleInputChange("namaAyah", e.target.value)} required className="h-10 rounded-lg border-slate-200 bg-white shadow-sm text-sm font-normal" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pekerjaan Ayah <span className="text-destructive">*</span></Label>
                  <Input value={formData.pekerjaanAyah} onChange={e => handleInputChange("pekerjaanAyah", e.target.value)} required className="h-10 rounded-lg border-slate-200 bg-white shadow-sm text-sm font-normal" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Penghasilan Per Bulan <span className="text-destructive">*</span></Label>
                  <Select required onValueChange={(v) => handleInputChange("penghasilanAyah", v || "")} value={formData.penghasilanAyah}>
                    <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-white shadow-sm text-sm font-normal">
                      <SelectValue placeholder="Pilih Penghasilan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-3 Juta">Rp 2 Juta – Rp 3 Juta</SelectItem>
                      <SelectItem value="3-4 Juta">Rp 3 Juta – Rp 4 Juta</SelectItem>
                      <SelectItem value="4-5 Juta">Rp 4 Juta – Rp 5 Juta</SelectItem>
                      <SelectItem value="> 5 Juta">Di atas Rp 5 Juta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data Ibu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-5 md:p-6 rounded-xl border border-slate-100/60 bg-slate-50/30">
                <h4 className="md:col-span-2 font-bold text-[10px] text-primary/50 uppercase tracking-[0.1em] flex items-center gap-1.5 mb-0.5">
                  Data Ibu Kandung
                </h4>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Nama Ibu <span className="text-destructive">*</span></Label>
                  <Input value={formData.namaIbu} onChange={e => handleInputChange("namaIbu", e.target.value)} required className="h-10 rounded-lg border-slate-200 bg-white shadow-sm text-sm font-normal" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pekerjaan Ibu <span className="text-slate-300">(Opsional)</span></Label>
                  <Input value={formData.pekerjaanIbu} onChange={e => handleInputChange("pekerjaanIbu", e.target.value)} className="h-10 rounded-lg border-slate-200 bg-white shadow-sm text-sm font-normal" />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Nomor HP/WhatsApp Wali (Aktif) <span className="text-destructive">*</span></Label>
                <Input
                  value={formData.noHpWali}
                  onChange={e => handleInputChange("noHpWali", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                  className="h-10 rounded-lg bg-white border-slate-200 focus:bg-white transition-all text-sm font-normal"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-5 border-t border-slate-50">
              <button type="button" onClick={prevStep} className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 font-semibold uppercase text-[10px]">
                <ChevronLeft className="w-3.5 h-3.5" /> Kembali
              </button>
              <Button type="button" onClick={nextStep} className="bg-primary px-7 h-10 rounded-lg font-bold text-[13px]">
                Selanjutnya <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: PART C - ADMINISTRASI (UPLOAD) */}
        {step === 3 && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-lg shadow-primary/5 animate-in slide-in-from-right-8 duration-500">
            <h3 className="text-base font-bold text-primary mb-6 flex items-center gap-2.5 border-b border-primary/5 pb-3.5">
              <span className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center"><FolderOpen className="w-3.5 h-3.5" /></span>
              Bagian C: Berkas Administrasi
            </h3>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">No. Kartu Keluarga <span className="text-destructive">*</span></Label>
                <Input value={formData.noKk} onChange={e => handleInputChange("noKk", e.target.value)} placeholder="Kartu Keluarga (16 digit)" required className="h-10 rounded-lg text-sm font-normal" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* KK Upload */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scan Kartu Keluarga (Opsional)</Label>
                  <div className={`relative border border-dashed rounded-lg p-3.5 transition-all ${files.fileKK ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                    <input type="file" onChange={e => handleFileChange("fileKK", e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*,.pdf" />
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${files.fileKK ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'}`}>
                        {files.fileKK ? <CheckCircle2 className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`font-semibold text-[11px] truncate ${files.fileKK ? 'text-primary' : 'text-slate-500'}`}>{files.fileKK ? files.fileKK.name : "Pilih File"}</p>
                        <p className="text-[9px] text-slate-300 uppercase">JPG/PNG/PDF</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Akta Upload */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scan Akta Kelahiran (Opsional)</Label>
                  <div className={`relative border border-dashed rounded-lg p-3.5 transition-all ${files.fileAkta ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                    <input type="file" onChange={e => handleFileChange("fileAkta", e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*,.pdf" />
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${files.fileAkta ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'}`}>
                        {files.fileAkta ? <CheckCircle2 className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`font-semibold text-[11px] truncate ${files.fileAkta ? 'text-primary' : 'text-slate-500'}`}>{files.fileAkta ? files.fileAkta.name : "Pilih File"}</p>
                        <p className="text-[9px] text-slate-300 uppercase">JPG/PNG/PDF</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ijazah Upload */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Scan Ijazah Terakhir (Opsional)</Label>
                  <div className={`relative border border-dashed rounded-lg p-3.5 transition-all ${files.fileIjazah ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                    <input type="file" onChange={e => handleFileChange("fileIjazah", e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*,.pdf" />
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${files.fileIjazah ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'}`}>
                        {files.fileIjazah ? <CheckCircle2 className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`font-semibold text-[11px] truncate ${files.fileIjazah ? 'text-primary' : 'text-slate-500'}`}>{files.fileIjazah ? files.fileIjazah.name : "Pilih File"}</p>
                        <p className="text-[9px] text-slate-300 uppercase">JPG/PNG/PDF</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foto Upload */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pas Foto 3x4 (Opsional)</Label>
                  <div className={`relative border border-dashed rounded-lg p-3.5 transition-all ${files.fileFoto ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                    <input type="file" onChange={e => handleFileChange("fileFoto", e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${files.fileFoto ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'}`}>
                        {files.fileFoto ? <CheckCircle2 className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`font-semibold text-[11px] truncate ${files.fileFoto ? 'text-primary' : 'text-slate-500'}`}>{files.fileFoto ? files.fileFoto.name : "Unggah Foto"}</p>
                        <p className="text-[9px] text-slate-300 uppercase">JPG atau PNG</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-5 border-t border-slate-50">
              <button type="button" onClick={prevStep} className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 font-semibold uppercase text-[10px]">
                <ChevronLeft className="w-3.5 h-3.5" /> Kembali
              </button>
              <Button type="button" onClick={nextStep} className="bg-primary px-7 h-10 rounded-lg font-bold text-[13px]">
                Selanjutnya <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: PART D - PEMBAYARAN */}
        {step === 4 && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-lg shadow-primary/5 animate-in slide-in-from-right-8 duration-500">
            <h3 className="text-base font-bold text-primary mb-6 flex items-center gap-2.5 border-b border-primary/5 pb-3.5">
              <span className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center"><Wallet className="w-3.5 h-3.5" /></span>
              Bagian D: Detail Pembayaran
            </h3>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-5 opacity-[0.03]">
                <CreditCard className="w-20 h-20" />
              </div>
              <div className="flex items-center gap-1.5 text-gold font-bold text-[9px] uppercase tracking-widest mb-2">
                <AlertCircle className="w-3 h-3" /> Rekening PSB
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-400 text-[9px] font-bold uppercase mb-0.5">BRI (002)</p>
                  <p className="text-base font-black text-primary tracking-tight">0573-0100-1017-300</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">a.n. PSB BALI BINA INSANI</p>
                </div>
                <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-lg text-primary font-bold text-xs shadow-sm">
                  Rp {Number(biaya.toString().replace(/\./g, '').replace(/,/g, '')).toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Nama Rek. Pengirim <span className="text-destructive">*</span></Label>
                  <Input value={formData.namaPengirim} onChange={e => handleInputChange("namaPengirim", e.target.value)} placeholder="Nama yang tertera di bukti" required className="h-10 rounded-lg text-sm font-normal" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tanggal Transfer <span className="text-destructive">*</span></Label>
                  <Input type="date" value={formData.tanggalTransfer} onChange={e => handleInputChange("tanggalTransfer", e.target.value)} required className="h-10 rounded-lg text-sm font-normal" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Bukti Transfer (Screenshot/Foto) <span className="text-destructive">*</span></Label>
                <div className={`relative border border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center ${files.fileBukti ? 'border-primary bg-primary/5' : 'border-slate-100'}`}>
                  <input type="file" onChange={e => handleFileChange("fileBukti", e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                  
                  {files.fileBukti ? (
                    <>
                      <CheckCircle2 className="w-7 h-7 text-primary mb-1.5" />
                      <p className="font-semibold text-primary text-[11px] truncate max-w-[180px]">{files.fileBukti.name}</p>
                      <button type="button" className="text-[9px] text-slate-400 underline mt-0.5">Ganti File</button>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-2.5">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-slate-500 text-[11px]">Unggah Bukti Transfer</p>
                      <p className="text-[8.5px] text-slate-300 mt-0.5 uppercase tracking-wide">MAX 3MB (JPG/PNG)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 text-left mb-6 mt-8">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="pernyataan"
                  checked={formData.pernyataanCorrect}
                  onCheckedChange={(checked) => handleInputChange("pernyataanCorrect", !!checked)}
                  className="mt-0.5 w-5 h-5 rounded border-primary text-primary"
                />
                <Label htmlFor="pernyataan" className="text-[12px] text-slate-600 leading-relaxed cursor-pointer font-normal">
                  Saya menyatakan bahwa seluruh data yang diisi adalah **benar dan valid**. Data yang sudah dikirim akan masuk ke proses seleksi administratif.
                </Label>
              </div>
            </div>

            {formError && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-semibold animate-in zoom-in-95">
                {formError}
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-5 border-t border-slate-50">
              <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                 <button type="button" onClick={prevStep} className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 font-semibold uppercase text-[10px]">
                   <ChevronLeft className="w-3.5 h-3.5" /> Kembali
                 </button>
                 <span className="text-slate-300">|</span>
                 <button type="button" onClick={resetForm} className="text-destructive/80 hover:text-destructive transition-colors font-semibold uppercase text-[10px]">
                   Kosongkan
                 </button>
              </div>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.pernyataanCorrect}
                className="w-full md:w-auto px-10 bg-primary hover:bg-[#133d24] text-white font-bold h-12 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? "Mengirim..." : <>Daftar Sekarang <CheckCircle2 className="w-4 h-4 ml-1" /></>}
              </Button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Globe, Settings as SettingsIcon, Info, Upload, ImageIcon, BookOpen, PenTool, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { AdminDashboardSkeleton } from "@/components/admin/AdminSkeletons";

export default function PengaturanPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    namaWeb: "",
    logoUrl: "",
    heroBadge: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImageUrl: "",
    heroForegroundImageUrl: "",
    visi: "",
    misi: "",
    alamat: "",
    email: "",
    noWa: "",
    igUrl: "",
    fbUrl: "",
    ytUrl: "",
    infoRekening: "",
    biayaRegistrasi: "",
    brosurUrl: "",
    mtsLogoUrl: "",
    mtsDeskripsi: "",
    mtsPoin: "",
    maLogoUrl: "",
    maDeskripsi: "",
    maPoin: "",
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      if (data) {
        setFormData({
          namaWeb: data.namaWeb || "",
          logoUrl: data.logoUrl || "",
          heroBadge: data.heroBadge || "",
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroImageUrl: data.heroImageUrl || "",
          heroForegroundImageUrl: data.heroForegroundImageUrl || "",
          visi: data.visi || "",
          misi: data.misi || "",
          alamat: data.alamat || "",
          email: data.email || "",
          noWa: data.noWa || "",
          igUrl: data.igUrl || "",
          fbUrl: data.fbUrl || "",
          ytUrl: data.ytUrl || "",
          infoRekening: data.infoRekening || "",
          biayaRegistrasi: data.biayaRegistrasi || "",
          brosurUrl: data.brosurUrl || "",
          mtsLogoUrl: data.mtsLogoUrl || "",
          mtsDeskripsi: data.mtsDeskripsi || "",
          mtsPoin: data.mtsPoin || "",
          maLogoUrl: data.maLogoUrl || "",
          maDeskripsi: data.maDeskripsi || "",
          maPoin: data.maPoin || "",
        });
      }
    } catch (error) {
      toast.error("Gagal mengambil pengaturan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData(prev => ({ ...prev, [field]: url }));
        toast.success("File berhasil diunggah");
      } else {
        toast.error("Gagal mengunggah file");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Pengaturan berhasil disimpan");
      } else {
        toast.error("Gagal menyimpan pengaturan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="max-w-6xl space-y-10 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-0 z-20 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <SettingsIcon className="w-5 h-5" /> 
             </div>
             Konfigurasi Website
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Sesuaikan identitas sekolah, visi misi, dan aset digital secara real-time.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || isUploading} className="w-full md:w-auto gap-2 bg-primary hover:bg-[#143d24] h-12 px-10 font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
          {isSaving ? "Menyimpan..." : <><Save className="w-5 h-5" /> Update Website</>}
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Identitas Branding */}
        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-1.5 h-6 rounded-full bg-primary" />
            <h3 className="text-lg font-bold text-slate-800 font-heading tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 opacity-40" /> Branding Utama
            </h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Nama Sekolah</Label>
              <Input 
                value={formData.namaWeb} 
                onChange={(e) => setFormData({ ...formData, namaWeb: e.target.value })} 
                placeholder="Nama Sekolah..." 
                className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>

            <div className="space-y-4">
              <Label className="font-bold text-slate-700 text-sm ml-1">Logo Website</Label>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden group relative shadow-sm">
                  {formData.logoUrl ? (
                    <Image 
                      src={formData.logoUrl} 
                      alt="Logo" 
                      fill 
                      priority
                      className="object-contain p-2" 
                      sizes="64px"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  )}
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px] z-10">
                    <Upload className="text-white w-5 h-5 animate-pulse" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "logoUrl")} />
                  </label>
                </div>
                <div className="flex-1 space-y-2">
                  <Input value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} placeholder="URL Logo..." className="h-8 text-[10px] font-mono rounded-lg border-slate-200" />
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pl-1">Klik kotak untuk upload</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Alamat Lengkap</Label>
              <Textarea 
                value={formData.alamat} 
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} 
                placeholder="Alamat lengkap sekolah..." 
                className="min-h-[120px] rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600" 
              />
            </div>
          </div>
        </section>

        {/* Profil Section */}
        <section className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-1.5 h-6 rounded-full bg-primary" />
            <h3 className="text-lg font-bold text-slate-800 font-heading tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 opacity-40" /> Profil & Narasi
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="space-y-2.5">
                <Label className="font-bold text-slate-700 text-sm ml-1">Visi Sekolah</Label>
                <Textarea 
                  value={formData.visi} 
                  onChange={(e) => setFormData({ ...formData, visi: e.target.value })} 
                  placeholder="Visi pesantren..." 
                  className="min-h-[100px] rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600 italic" 
                />
              </div>
              <div className="space-y-2.5">
                <Label className="font-bold text-slate-700 text-sm ml-1">Misi Sekolah (Baris Per Baris)</Label>
                <Textarea 
                  value={formData.misi} 
                  onChange={(e) => setFormData({ ...formData, misi: e.target.value })} 
                  placeholder="Masukkan misi satu per satu..." 
                  className="min-h-[180px] rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600" 
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-[#FAFAF8] rounded-2xl border border-slate-100 space-y-4">
                <Label className="font-bold text-slate-700 text-sm flex items-center gap-2 ml-1">
                  <ImageIcon className="w-4 h-4 opacity-50" /> Ilustrasi Profil Page
                </Label>
                <div className="relative group overflow-hidden rounded-xl aspect-video bg-slate-200 border border-slate-300 shadow-inner">
                  {formData.heroImageUrl ? (
                    <Image 
                      src={formData.heroImageUrl} 
                      alt="Profile BG" 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">Klik untuk Upload</div>
                  )}
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px] z-10">
                    <Upload className="w-10 h-10 mb-2 text-white animate-bounce" />
                    <span className="font-bold text-xs text-white uppercase tracking-widest">Update Foto</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "heroImageUrl")} />
                  </label>
                </div>
                <Input value={formData.heroImageUrl} onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })} placeholder="URL Ilustrasi..." className="h-9 text-[10px] font-mono bg-white border-slate-200 rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Kontak & Media Sosial */}
        <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-1.5 h-6 rounded-full bg-primary" />
            <h3 className="text-lg font-bold text-slate-800 font-heading tracking-tight flex items-center gap-2">
              <PenTool className="w-5 h-5 opacity-40" /> Media Sosial
            </h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Nomor WhatsApp</Label>
              <Input 
                value={formData.noWa} 
                onChange={(e) => setFormData({ ...formData, noWa: e.target.value })} 
                placeholder="628..." 
                className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>
            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Email Sekolah</Label>
              <Input 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                placeholder="school@email.com" 
                className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>
            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Instagram Profile</Label>
              <Input 
                value={formData.igUrl} 
                onChange={(e) => setFormData({ ...formData, igUrl: e.target.value })} 
                placeholder="https://instagram.com/..." 
                className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>
            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Facebook Page</Label>
              <Input 
                value={formData.fbUrl} 
                onChange={(e) => setFormData({ ...formData, fbUrl: e.target.value })} 
                placeholder="https://facebook.com/..." 
                className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all" 
              />
            </div>
          </div>
        </section>

        {/* Informasi Pendaftaran */}
        <section className="bg-primary p-10 rounded-2xl text-white space-y-10 shadow-2xl shadow-primary/20 lg:col-span-2 relative overflow-hidden">
          {/* Overlay Decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            <h3 className="text-xl font-bold font-heading flex items-center gap-3 border-b border-white/10 pb-6 tracking-tight">
              <Info className="w-6 h-6 text-[#FFD700]" /> Konfigurasi Pendaftaran (PPDB)
            </h3>
            <div className="grid md:grid-cols-2 gap-10 mt-8">
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-white/70 font-bold text-sm ml-1 tracking-widest uppercase">Biaya Registrasi (Nominal)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-white/40">Rp</span>
                    <Input 
                      type="number" 
                      value={formData.biayaRegistrasi} 
                      onChange={(e) => setFormData({ ...formData, biayaRegistrasi: e.target.value })} 
                      className="bg-white/10 border-white/20 text-white h-14 pl-12 rounded-xl text-2xl font-black focus:bg-white/20 focus:ring-0 transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-white/70 font-bold text-sm ml-1 tracking-widest uppercase">Instruksi Rekening Pembayaran</Label>
                  <Textarea 
                    value={formData.infoRekening} 
                    onChange={(e) => setFormData({ ...formData, infoRekening: e.target.value })} 
                    placeholder="Contoh: Transfer ke BRI 123-456 a/n Yayasan..." 
                    className="bg-white/10 border-white/20 text-white min-h-[120px] rounded-xl focus:bg-white/20 focus:ring-0 transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-white/70 font-bold text-sm ml-1 tracking-widest uppercase">Badge Hero Utama</Label>
                  <Input 
                    value={formData.heroBadge} 
                    onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })} 
                    className="bg-white/10 border-white/20 text-white h-12 rounded-xl focus:bg-white/20 focus:ring-0" 
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white/70 font-bold text-sm ml-1 tracking-widest uppercase">Headline Utama Hero</Label>
                  <Textarea 
                    value={formData.heroTitle} 
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })} 
                    className="bg-white/10 border-white/20 text-white min-h-[100px] rounded-xl focus:bg-white/20 focus:ring-0 font-bold text-lg" 
                  />
                </div>

                <div className="pt-4 space-y-4">
                  <Label className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-[0.15em]">
                    <FileText className="w-4 h-4 text-[#FFD700]" /> Dokumentasi Brosur (PDF)
                  </Label>
                  <div className="flex flex-col gap-3 p-5 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="bg-white text-primary border-none hover:bg-[#FFD700] hover:text-primary h-11 px-6 font-bold rounded-xl gap-2 transition-all active:scale-95 shadow-lg"
                        onClick={() => document.getElementById('brosur-upload')?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="w-4 h-4" /> 
                        {formData.brosurUrl ? "Update Brosur" : "Upload File PDF"}
                        <input 
                          id="brosur-upload"
                          type="file" 
                          className="hidden" 
                          accept=".pdf" 
                          onChange={(e) => handleFileUpload(e, "brosurUrl")} 
                        />
                      </Button>
                      {formData.brosurUrl && (
                        <a 
                          href={formData.brosurUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          title="Lihat PDF"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>
                    <Input 
                      value={formData.brosurUrl} 
                      onChange={(e) => setFormData({ ...formData, brosurUrl: e.target.value })} 
                      placeholder="Path berkas brosur..." 
                      className="bg-transparent border-white/10 text-white/50 h-8 text-[9px] font-mono rounded-lg focus:ring-0 placeholder:text-white/20" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Jenjang Pendidikan */}
        <section className="lg:col-span-3 bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-1.5 h-6 rounded-full bg-primary" />
            <h3 className="text-lg font-bold text-slate-800 font-heading tracking-tight">Jenjang Pendidikan</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-10">

            {/* MTs */}
            <div className="space-y-5">
              <p className="text-sm font-bold text-slate-600 uppercase tracking-widest border-b border-slate-100 pb-2">Madrasah Tsanawiyah (MTs)</p>
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 text-sm ml-1">Logo MTs</Label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden group relative shadow-sm">
                    {formData.mtsLogoUrl ? (
                      <img src={formData.mtsLogoUrl} alt="Logo MTs" className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xs font-bold text-green-600">MTs</span>
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px] z-10">
                      <Upload className="text-white w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "mtsLogoUrl")} />
                    </label>
                  </div>
                  <div className="flex-1">
                    <Input value={formData.mtsLogoUrl} onChange={(e) => setFormData({ ...formData, mtsLogoUrl: e.target.value })} placeholder="URL Logo MTs..." className="h-8 text-[10px] font-mono rounded-lg border-slate-200" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pl-1 mt-1">Klik kotak untuk upload</p>
                  </div>
                </div>
              </div>
              {/* Deskripsi */}
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 text-sm ml-1">Deskripsi MTs</Label>
                <Textarea
                  value={formData.mtsDeskripsi}
                  onChange={(e) => setFormData({ ...formData, mtsDeskripsi: e.target.value })}
                  placeholder="Deskripsi singkat jenjang MTs..."
                  className="min-h-[100px] rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600"
                />
              </div>
              {/* Poin */}
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 text-sm ml-1">Poin Keunggulan MTs <span className="text-slate-400 font-normal">(satu per baris)</span></Label>
                <Textarea
                  value={formData.mtsPoin}
                  onChange={(e) => setFormData({ ...formData, mtsPoin: e.target.value })}
                  placeholder={`Tahfidz Al-Qur'an (target 5 juz)\nKajian Kitab Kuning dasar\nBahasa Arab & Inggris aktif`}
                  className="min-h-[110px] rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600"
                />
              </div>
            </div>

            {/* MA */}
            <div className="space-y-5">
              <p className="text-sm font-bold text-slate-600 uppercase tracking-widest border-b border-slate-100 pb-2">Madrasah Aliyah (MA)</p>
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 text-sm ml-1">Logo MA</Label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden group relative shadow-sm">
                    {formData.maLogoUrl ? (
                      <img src={formData.maLogoUrl} alt="Logo MA" className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xs font-bold text-[#1A4D2E]">MA</span>
                    )}
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px] z-10">
                      <Upload className="text-white w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "maLogoUrl")} />
                    </label>
                  </div>
                  <div className="flex-1">
                    <Input value={formData.maLogoUrl} onChange={(e) => setFormData({ ...formData, maLogoUrl: e.target.value })} placeholder="URL Logo MA..." className="h-8 text-[10px] font-mono rounded-lg border-slate-200" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pl-1 mt-1">Klik kotak untuk upload</p>
                  </div>
                </div>
              </div>
              {/* Deskripsi */}
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 text-sm ml-1">Deskripsi MA</Label>
                <Textarea
                  value={formData.maDeskripsi}
                  onChange={(e) => setFormData({ ...formData, maDeskripsi: e.target.value })}
                  placeholder="Deskripsi singkat jenjang MA..."
                  className="min-h-[100px] rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600"
                />
              </div>
              {/* Poin */}
              <div className="space-y-2">
                <Label className="font-bold text-slate-700 text-sm ml-1">Poin Keunggulan MA <span className="text-slate-400 font-normal">(satu per baris)</span></Label>
                <Textarea
                  value={formData.maPoin}
                  onChange={(e) => setFormData({ ...formData, maPoin: e.target.value })}
                  placeholder={`Tahfidz Al-Qur'an (target 10 juz+)\nKajian Kitab Kuning lanjutan\nTahassus Bahasa Arab, Inggris & Jepang`}
                  className="min-h-[110px] rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600"
                />
              </div>
            </div>

          </div>
        </section>
      </form>
    </div>
  );
}

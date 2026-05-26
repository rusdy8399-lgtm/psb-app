"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, CalendarDays, Upload, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeletons";
import imageCompression from "browser-image-compression";

interface KegiatanData {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal: string;
  fotoUrl: string;
}

export default function KegiatanCMSPage() {
  const [data, setData] = useState<KegiatanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KegiatanData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    tanggal: "",
    fotoUrl: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/kegiatan");
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast.error("Gagal mengambil data kegiatan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    if (file.type.startsWith("image/")) {
      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        file = await imageCompression(file, options);
      } catch (error) {
        console.error("Compression error:", error);
      }
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData(prev => ({ ...prev, fotoUrl: url }));
        toast.success("Foto berhasil diunggah");
      } else {
        toast.error("Gagal mengunggah foto");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenDialog = (item: KegiatanData | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        judul: item.judul,
        deskripsi: item.deskripsi,
        tanggal: item.tanggal,
        fotoUrl: item.fotoUrl,
      });
    } else {
      setEditingItem(null);
      setFormData({
        judul: "",
        deskripsi: "",
        tanggal: new Date().toISOString().split('T')[0],
        fotoUrl: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/admin/kegiatan/${editingItem.id}` : "/api/admin/kegiatan";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingItem ? "Kegiatan diperbarui" : "Kegiatan baru ditambahkan");
        setIsDialogOpen(false);
        fetchData();
      } else {
        toast.error("Terjadi kesalahan");
      }
    } catch (error) {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kegiatan ini?")) return;
    
    try {
      const response = await fetch(`/api/admin/kegiatan/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Kegiatan dihapus");
        fetchData();
      }
    } catch (error) {
      toast.error("Gagal menghapus kegiatan");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CalendarDays className="w-5 h-5" /> 
             </div>
             Manajemen Kegiatan
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelola daftar kegiatan dan berita terbaru pesantren secara dinamis.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 bg-primary hover:bg-[#143d24] h-11 px-6 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4" /> Tambah Kegiatan
        </Button>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        {isLoading ? (
          <AdminTableSkeleton rows={3} />
        ) : (
          <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b border-slate-100 h-14">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-24 font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-6">Foto</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Judul Kegiatan</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Tanggal</TableHead>
                  <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest text-slate-400 pr-8">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none group">
                      <TableCell className="pl-6">
                        <div className="relative w-16 h-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <Image 
                            src={item.fotoUrl} 
                            alt={item.judul} 
                            fill 
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-700 text-sm leading-snug">{item.judul}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-60 line-clamp-1 max-w-md">{item.deskripsi}</p>
                      </TableCell>
                      <TableCell>
                         <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                           {item.tanggal}
                         </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button onClick={() => handleOpenDialog(item)} variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-primary/5 h-10 w-10 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete(item.id)} variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-10 w-10 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium italic">Belum ada data kegiatan.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl w-[95vw] overflow-hidden rounded-[24px] border-none shadow-2xl p-0 bg-slate-50 max-h-[92vh] flex flex-col">
          <DialogHeader className="p-6 md:p-8 bg-white border-b border-slate-100 shrink-0">
            <DialogTitle className="font-heading text-xl font-bold flex items-center gap-3 text-slate-800">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CalendarDays className="w-5 h-5" /> 
               </div>
               {editingItem ? "Edit Data Kegiatan" : "Tambah Kegiatan Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Paper Sheet Editor (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-200/80 rounded-2xl p-8 md:p-10 min-h-[500px] flex flex-col relative transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                {/* Paper Header / Title Input */}
                <div className="relative mb-4">
                  <input 
                    required 
                    value={formData.judul} 
                    onChange={(e) => setFormData({...formData, judul: e.target.value})} 
                    placeholder="Ketik Judul Kegiatan / Berita di sini..." 
                    className="w-full text-2xl md:text-3xl font-bold text-slate-800 placeholder:text-slate-200 border-none outline-none focus:outline-none focus:ring-0 p-0 bg-transparent font-sans"
                  />
                </div>
                
                {/* Divider */}
                <div className="h-[2px] bg-slate-100 w-full mb-6" />

                {/* Paper Body / Textarea Editor */}
                <textarea
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  placeholder="Tuliskan isi redaksi berita atau deskripsi kegiatan secara lengkap dan leluasa di sini..."
                  className="w-full flex-1 min-h-[350px] text-base text-slate-700 leading-relaxed placeholder:text-slate-300 border-none outline-none focus:outline-none focus:ring-0 p-0 resize-none bg-transparent font-sans"
                />
              </div>
            </div>
            
            {/* Right Column: Settings & Meta Sidebar (1/3 width) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Publication Settings Panel */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Detail Publikasi
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Tanggal */}
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700 text-xs ml-1">Tanggal Kegiatan</Label>
                      <Input 
                        type="date" 
                        required 
                        value={formData.tanggal} 
                        onChange={(e) => setFormData({...formData, tanggal: e.target.value})} 
                        className="h-11 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10 text-sm"
                      />
                    </div>

                    {/* Foto Upload */}
                    <div className="space-y-3 pt-2">
                      <Label className="font-bold text-slate-700 text-xs ml-1">Foto Kegiatan</Label>
                      <div className="relative group overflow-hidden rounded-xl aspect-video w-full bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center">
                        {formData.fotoUrl ? (
                          <img src={formData.fotoUrl} className="w-full h-full object-cover" alt="preview" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <ImageIcon className="w-8 h-8 opacity-30" />
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Belum ada foto</span>
                          </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                          <Upload className="text-white w-6 h-6 mb-1 animate-bounce" />
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Ganti Foto</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                      </div>
                      <div className="space-y-2">
                        <Input 
                          value={formData.fotoUrl} 
                          onChange={(e) => setFormData({...formData, fotoUrl: e.target.value})} 
                          placeholder="URL Foto..." 
                          className="h-9 text-[10px] font-mono rounded-lg border-slate-200" 
                        />
                        <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                          * Klik area preview foto di atas untuk mengunggah dari komputer Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions Panel */}
              <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-[#143d24] font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                  disabled={isUploading}
                >
                  {isUploading ? "Mengunggah..." : (editingItem ? "Simpan Perubahan" : "Posting Kegiatan")}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  className="w-full h-12 font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                  disabled={isUploading}
                >
                  Batal
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Upload, ImageIcon } from "lucide-react";
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

interface SliderData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  bgImageUrl: string;
  fgImageUrl: string;
  isActive: boolean;
  order: number;
}

export default function SliderCMSPage() {
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<SliderData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    badge: "",
    title: "",
    subtitle: "",
    bgImageUrl: "",
    fgImageUrl: "",
    isActive: true,
    order: 0
  });

  const fetchSliders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/slider");
      const data = await response.json();
      setSliders(data);
    } catch (error) {
      toast.error("Gagal mengambil data slider");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "bgImageUrl" | "fgImageUrl") => {
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
        toast.success("Gambar berhasil diunggah");
      } else {
        toast.error("Gagal mengunggah gambar");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenDialog = (slider: SliderData | null = null) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        badge: slider.badge || "",
        title: slider.title,
        subtitle: slider.subtitle || "",
        bgImageUrl: slider.bgImageUrl,
        fgImageUrl: slider.fgImageUrl || "",
        isActive: slider.isActive,
        order: slider.order
      });
    } else {
      setEditingSlider(null);
      setFormData({
        badge: "",
        title: "",
        subtitle: "",
        bgImageUrl: "",
        fgImageUrl: "",
        isActive: true,
        order: sliders.length + 1
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSlider ? "PUT" : "POST";
    const url = editingSlider ? `/api/admin/slider/${editingSlider.id}` : "/api/admin/slider";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingSlider ? "Slider diperbarui" : "Slider baru ditambahkan");
        setIsDialogOpen(false);
        fetchSliders();
      } else {
        toast.error("Terjadi kesalahan");
      }
    } catch (error) {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus banner ini?")) return;
    
    try {
      const response = await fetch(`/api/admin/slider/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Slider dihapus");
        fetchSliders();
      }
    } catch (error) {
      toast.error("Gagal menghapus slider");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-800 tracking-tight">Manajemen Slider Beranda</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola gambar dan teks yang bergeser otomatis di halaman depan.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 bg-primary hover:bg-[#143d24] h-11 px-6 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4" /> Tambah Banner
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
                  <TableHead className="w-20 font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-6">Urutan</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Preview</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Judul Banner</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest text-slate-400 pr-8">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sliders.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none group">
                    <TableCell className="font-bold text-center text-slate-300 pl-6">{s.order}</TableCell>
                    <TableCell>
                      <div className="relative w-28 h-16 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-slate-100 group-hover:scale-105 transition-transform duration-300">
                        <Image 
                          src={s.bgImageUrl} 
                          alt="bg" 
                          fill 
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-slate-700 text-sm leading-snug">{s.title.replace(/<br \/>/g, ' ')}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 opacity-60">ID: {s.id.slice(0, 8)}...</p>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border
                          ${s.isActive 
                            ? "bg-green-50 text-green-700 border-green-100" 
                            : "bg-slate-50 text-slate-400 border-slate-100"}`}
                      >
                        {s.isActive ? "Aktif" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button onClick={() => handleOpenDialog(s)} variant="ghost" size="icon" className="text-slate-400 hover:text-primary hover:bg-primary/5 h-10 w-10 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleDelete(s.id)} variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-10 w-10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sliders.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium italic">Belum ada banner slider.</TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] rounded-[24px] border-none shadow-2xl p-0">
          <DialogHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
            <DialogTitle className="font-heading text-xl font-bold flex items-center gap-3 text-slate-800">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon className="w-5 h-5" /> 
               </div>
               {editingSlider ? "Edit Banner Slider" : "Tambah Banner Slider"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="font-bold text-slate-700 text-sm ml-1">Label Badge (Kuning)</Label>
                <Input 
                  value={formData.badge} 
                  onChange={(e) => setFormData({...formData, badge: e.target.value})} 
                  placeholder="PENDAFTARAN DIBUKA" 
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="space-y-2.5">
                <Label className="font-bold text-slate-700 text-sm ml-1">Urutan Tampil</Label>
                <Input 
                  type="number" 
                  value={formData.order} 
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} 
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
            
            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Judul Utama (Besar)</Label>
              <Input 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="Contoh: Membentuk Generasi Qur'ani" 
                className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1 opacity-70">Gunakan &lt;br /&gt; untuk baris baru secara paksa.</p>
            </div>
            
            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Sub-judul (Teks Kecil)</Label>
              <Input 
                value={formData.subtitle} 
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
                placeholder="Excellent with Character" 
                className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#FAFAF8] rounded-2xl border border-slate-100">
               <div className="space-y-3">
                  <Label className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Latar Belakang (BG)
                  </Label>
                  <div className="flex flex-col gap-3">
                     <div className="relative group overflow-hidden rounded-xl aspect-video bg-slate-200 border border-slate-300 shadow-inner">
                        {formData.bgImageUrl ? (
                           <img src={formData.bgImageUrl} className="w-full h-full object-cover" alt="prev" />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8 opacity-20" /></div>
                        )}
                        <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                           <Upload className="text-white w-8 h-8 mb-2 animate-bounce" />
                           <span className="text-white text-[10px] font-bold uppercase tracking-widest">Upload BG</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "bgImageUrl")} disabled={isUploading} />
                        </label>
                     </div>
                     <Input required value={formData.bgImageUrl} onChange={(e) => setFormData({...formData, bgImageUrl: e.target.value})} placeholder="URL Gambar..." className="h-9 text-[10px] font-mono rounded-lg border-slate-200" />
                  </div>
               </div>

               <div className="space-y-3">
                  <Label className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Overlay Depan (FG)
                  </Label>
                  <div className="flex flex-col gap-3">
                     <div className="relative group overflow-hidden rounded-xl aspect-video bg-slate-200 border border-slate-300 shadow-inner">
                        {formData.fgImageUrl ? (
                           <img src={formData.fgImageUrl} className="w-full h-full object-contain p-2" alt="prev" />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8 opacity-20" /></div>
                        )}
                        <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                           <Upload className="text-white w-8 h-8 mb-2 animate-bounce" />
                           <span className="text-white text-[10px] font-bold uppercase tracking-widest">Upload FG</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "fgImageUrl")} disabled={isUploading} />
                        </label>
                     </div>
                     <Input value={formData.fgImageUrl} onChange={(e) => setFormData({...formData, fgImageUrl: e.target.value})} placeholder="URL Overlay..." className="h-9 text-[10px] font-mono rounded-lg border-slate-200" />
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <input 
                type="checkbox" 
                id="active" 
                className="w-5 h-5 accent-primary cursor-pointer rounded-lg"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              <Label htmlFor="active" className="cursor-pointer font-bold text-slate-700 text-sm">Tampilkan banner ini di beranda</Label>
            </div>

            <DialogFooter className="pt-8 border-t border-slate-100 flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="h-12 font-bold rounded-xl border-slate-200 px-8 text-slate-600 hover:bg-slate-50" disabled={isUploading}>Batal</Button>
              <Button type="submit" className="h-12 bg-primary hover:bg-[#143d24] font-bold rounded-xl px-10 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isUploading}>
                {isUploading ? "Mengunggah..." : (editingSlider ? "Simpan Perbaikan" : "Posting Banner")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

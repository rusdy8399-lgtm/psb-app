"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Images, Upload, ImageIcon } from "lucide-react";
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

interface GaleriData {
  id: string;
  judul: string;
  deskripsi: string | null;
  tanggal: string;
  fotoUrl: string;
}

export default function GaleriCMSPage() {
  const [data, setData] = useState<GaleriData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GaleriData | null>(null);
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
      const response = await fetch("/api/admin/galeri");
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast.error("Gagal mengambil data galeri");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleOpenDialog = (item: GaleriData | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        judul: item.judul,
        deskripsi: item.deskripsi || "",
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
    const url = editingItem ? `/api/admin/galeri/${editingItem.id}` : "/api/admin/galeri";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingItem ? "Foto diperbarui" : "Foto baru ditambahkan");
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
    if (!confirm("Hapus foto galeri ini?")) return;
    
    try {
      const response = await fetch(`/api/admin/galeri/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Foto galeri dihapus");
        fetchData();
      }
    } catch (error) {
      toast.error("Gagal menghapus foto");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Images className="w-5 h-5" /> 
             </div>
             Manajemen Galeri Foto
          </h2>
          <p className="text-sm text-slate-500 mt-1">Kelola koleksi dokumentasi foto pesantren secara sistematis.</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 bg-primary hover:bg-[#143d24] h-11 px-6 font-bold rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4" /> Tambah Foto
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
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Info Foto</TableHead>
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
                    <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium italic">Belum ada foto galeri.</TableCell>
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
                <Images className="w-5 h-5" /> 
               </div>
               {editingItem ? "Edit Foto Galeri" : "Tambah Foto Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2.5">
                  <Label className="font-bold text-slate-700 text-sm ml-1">Judul Foto</Label>
                  <Input 
                    required 
                    value={formData.judul} 
                    onChange={(e) => setFormData({...formData, judul: e.target.value})} 
                    placeholder="Masukkan judul foto..." 
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
                  />
               </div>
               <div className="space-y-2.5">
                  <Label className="font-bold text-slate-700 text-sm ml-1">Tanggal</Label>
                  <Input 
                    type="date" 
                    required 
                    value={formData.tanggal} 
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})} 
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
                  />
               </div>
            </div>

            <div className="space-y-2.5">
              <Label className="font-bold text-slate-700 text-sm ml-1">Deskripsi Tambahan (Opsional)</Label>
              <Textarea 
                value={formData.deskripsi} 
                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} 
                placeholder="Berikan deskripsi singkat untuk foto ini..."
                className="min-h-[150px] rounded-xl border-slate-200 bg-slate-50/30 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-4 p-6 bg-[#FAFAF8] rounded-2xl border border-slate-100">
               <Label className="font-bold text-slate-700 text-sm flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Unggah Foto Galeri
               </Label>
               <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="relative group overflow-hidden rounded-xl aspect-video w-full md:w-56 bg-slate-200 border border-slate-300 shadow-inner">
                     {formData.fotoUrl ? (
                        <img src={formData.fotoUrl} className="w-full h-full object-cover" alt="prev" />
                     ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8 opacity-20" /></div>
                     )}
                     <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                        <Upload className="text-white w-8 h-8 mb-2 animate-bounce" />
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">Ganti Foto</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                     </label>
                  </div>
                  <div className="flex-1 space-y-3">
                     <Input required value={formData.fotoUrl} onChange={(e) => setFormData({...formData, fotoUrl: e.target.value})} placeholder="URL Foto..." className="h-9 text-[10px] font-mono rounded-lg border-slate-200" />
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Klik area preview untuk mengunggah dokumentasi.</p>
                  </div>
               </div>
            </div>

            <DialogFooter className="pt-8 border-t border-slate-100 flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="h-12 font-bold rounded-xl border-slate-200 px-8 text-slate-600 hover:bg-slate-50" disabled={isUploading}>Batal</Button>
              <Button type="submit" className="h-12 bg-primary hover:bg-[#143d24] font-bold rounded-xl px-10 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isUploading}>
                {isUploading ? "Mengunggah..." : (editingItem ? "Simpan Perbaikan" : "Posting Foto Galeri")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

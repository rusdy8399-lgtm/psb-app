import { getFasilitas } from "@/lib/data-fetching";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function FasilitasPage() {
  const data = await getFasilitas();

  return (
    <div className="bg-slate-50 min-h-screen pt-12 md:pt-16 pb-16 md:pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            Fasilitas <span className="text-primary">Penunjang</span> Terbaik
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed mt-2">
            Menyediakan lingkungan yang kondusif untuk mendukung kegiatan belajar mengajar dan pembinaan karakter santri secara optimal.
          </p>
        </div>

        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, idx) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative w-full h-36 overflow-hidden image-shimmer">
                  <Image
                    src={item.fotoUrl}
                    alt={item.nama}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-base md:text-lg font-semibold font-sans text-slate-800 leading-tight group-hover:text-primary transition-colors">
                      {item.nama}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed font-sans line-clamp-2">
                      {item.deskripsi}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-50">
                    <Dialog>
                      <DialogTrigger 
                        render={
                          <Button variant="link" className="p-0 h-auto font-medium text-primary transition-all flex items-center gap-1.5 text-xs bg-transparent hover:bg-transparent group-hover/btn:opacity-80 cursor-pointer" />
                        }
                      >
                        Lihat Detail <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </DialogTrigger>
                      <DialogContent className="max-w-lg overflow-hidden rounded-[24px] p-0 border-0 shadow-2xl">
                        <div className="w-full h-56 md:h-64 relative image-shimmer">
                          <Image
                            src={item.fotoUrl}
                            alt={item.nama}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6 md:p-8">
                          <DialogHeader>
                            <DialogTitle className="text-xl md:text-2xl font-bold font-heading text-slate-800">{item.nama}</DialogTitle>
                            <DialogDescription className="text-sm text-slate-600 leading-relaxed font-sans pt-3">
                              {item.deskripsi}
                            </DialogDescription>
                          </DialogHeader>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <h3 className="text-xl font-bold text-slate-500 mb-2">Belum ada fasilitas yang ditampilkan.</h3>
            <p className="text-slate-400">Silakan hubungi admin untuk melakukan penambahan data fasilitas.</p>
          </div>
        )}
      </div>
    </div>
  );
}

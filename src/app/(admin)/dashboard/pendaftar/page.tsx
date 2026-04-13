import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Eye } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { pendaftar } from "@/lib/db/schema";
import { desc, like, or, sql, eq } from "drizzle-orm";
import { Pagination } from "@/components/admin/Pagination";

export default async function PendaftarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const page = typeof resolvedParams.page === "string" ? resolvedParams.page : "1";
  const currentPage = parseInt(page);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const whereClause = q ? or(
    like(pendaftar.namaLengkap, `%${q}%`),
    like(pendaftar.kodePendaftaran, `%${q}%`)
  ) : undefined;

  // Fetch count and data in parallel
  const [data, countRes] = await Promise.all([
    db.query.pendaftar.findMany({
      where: whereClause,
      orderBy: [desc(pendaftar.id)],
      limit,
      offset,
    }),
    db.select({ count: sql<number>`count(*)` })
      .from(pendaftar)
      .where(whereClause)
  ]);

  const totalCount = countRes[0].count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Manajemen Pendaftar</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola dan verifikasi data calon santri baru secara real-time.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
          <form action="" className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                name="q" 
                defaultValue={q} 
                placeholder="Cari nama atau kode pendaftaran..." 
                className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all shadow-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <Button type="submit" variant="secondary" className="h-11 px-6 font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border-none transition-all">
              Cari
            </Button>
            <Button variant="outline" className="h-11 px-4 gap-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-bold">
              <Filter className="w-4 h-4 opacity-70" /> Filter
            </Button>
          </form>
        </div>

        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b border-slate-100 h-14">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-6">Kode REG</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Nama Lengkap</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Jenjang</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Asal Sekolah</TableHead>
                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest text-slate-400 pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none group">
                    <TableCell className="font-mono font-bold text-primary text-xs tracking-tighter pl-6">{p.kodePendaftaran}</TableCell>
                    <TableCell className="font-bold text-slate-700">{p.namaLengkap}</TableCell>
                    <TableCell className="font-bold text-[10px] uppercase tracking-widest text-slate-500/80">{p.jenjang}</TableCell>
                    <TableCell className="text-slate-500 text-sm font-medium">{p.asalSekolah}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border
                          ${p.status === "Terkonfirmasi" 
                            ? "bg-green-50 text-green-700 border-green-100" 
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}
                      >
                        {p.status === "Terkonfirmasi" ? "Terkonfirmasi" : "Menunggu"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link href={`/dashboard/pendaftar/${p.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-primary hover:bg-primary/5 font-bold rounded-lg px-4 transition-all">
                          <Eye className="w-4 h-4 opacity-70" /> Detail
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-slate-400 font-medium">
                    Tidak ada data pendaftar ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-50 pt-8 px-2 gap-4">
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
            MENAMPILKAN <span className="text-slate-700">{offset + 1}-{Math.min(offset + limit, totalCount)}</span> DARI <span className="text-slate-700">{totalCount}</span> PENDAFTAR
          </p>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
}

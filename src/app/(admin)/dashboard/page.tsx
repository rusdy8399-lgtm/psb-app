import { Users, UserCheck, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { db } from "@/lib/db";
import { pendaftar } from "@/lib/db/schema";
import { sql, desc, eq, gte } from "drizzle-orm";
import { ExportButton } from "@/components/admin/ExportButton";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  // Fetch site stats and recent pendaftar in parallel
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [totalRes, mtsRes, maRes, newRes, recentPendaftar] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(pendaftar),
    db.select({ count: sql<number>`count(*)` }).from(pendaftar).where(eq(pendaftar.jenjang, "MTs")),
    db.select({ count: sql<number>`count(*)` }).from(pendaftar).where(eq(pendaftar.jenjang, "MA")),
    db.select({ count: sql<number>`count(*)` }).from(pendaftar).where(gte(pendaftar.createdAt, yesterday)),
    db.query.pendaftar.findMany({
      limit: 5,
      orderBy: [desc(pendaftar.id)],
    })
  ]);

  const totalCount = totalRes[0].count || 0;
  const mtsCount = mtsRes[0].count || 0;
  const maCount = maRes[0].count || 0;
  const newCount = newRes[0].count || 0;

  const stats = [
    { name: "Total Pendaftar", value: totalCount.toString(), icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Pendaftar MTs", value: mtsCount.toString(), icon: UserCheck, color: "text-green-500", bg: "bg-green-100" },
    { name: "Pendaftar MA", value: maCount.toString(), icon: UserCheck, color: "text-purple-500", bg: "bg-purple-100" },
    { name: "Pendaftar Baru (24j)", value: newCount.toString(), icon: Clock, color: "text-orange-500", bg: "bg-orange-100" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-800">Ringkasan PPDB</h2>
          <p className="text-slate-500 text-sm mt-1">Overview data pendaftaran santri baru secara real-time.</p>
        </div>
        <div className="flex gap-3">
          <ExportButton />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden group">
            <CardContent className="p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.name}</p>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon className="w-7 h-7" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-lg font-bold font-heading text-slate-800">Pendaftar Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50 text-slate-600">
              {recentPendaftar.length > 0 ? (
                recentPendaftar.map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{p.namaLengkap}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{p.jenjang} • {p.kodePendaftaran}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border bg-emerald-50 text-emerald-700 border-emerald-100`}>
                        Terdaftar
                      </span>
                      <Link href={`/dashboard/pendaftar/${p.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 font-bold rounded-lg px-4 transition-colors">Detail</Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 font-medium">Belum ada pendaftar terbaru.</div>
              )}
            </div>
            {recentPendaftar.length > 0 && (
              <div className="p-6 border-t border-slate-50 text-center bg-slate-50/30">
                <Link href="/dashboard/pendaftar">
                  <Button variant="link" className="text-primary font-bold text-sm hover:no-underline">Lihat Semua Pendaftar →</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

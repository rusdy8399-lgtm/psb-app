import { db, getSettings } from "@/lib/db";
import { pendaftar, ortuWakil, berkasDokumen } from "@/lib/db/schema";

export async function generateStaticParams() {
  const items = await db.query.pendaftar.findMany();
  return items.map((item) => ({
    id: item.id.toString(),
  }));
}
import { eq } from "drizzle-orm";
import { PendaftarDetailClient } from "@/components/admin/PendaftarDetailClient";
import { notFound } from "next/navigation";

export default async function PendaftarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Fetch settings for year info
  const settings = await getSettings();

  // Fetch pendaftar
  const data = await db.query.pendaftar.findFirst({
    where: eq(pendaftar.id, id),
  });

  if (!data) {
    notFound();
  }

  // Fetch ortu
  const ortu = await db.query.ortuWakil.findFirst({
    where: eq(ortuWakil.pendaftarId, id),
  });

  // Fetch berkas
  const berkas = await db.query.berkasDokumen.findFirst({
    where: eq(berkasDokumen.pendaftarId, id),
  });

  return (
    <div className="container mx-auto">
      <PendaftarDetailClient 
        pendaftar={data} 
        ortu={ortu} 
        berkas={berkas} 
        settings={settings || null}
      />
    </div>
  );
}

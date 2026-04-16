import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendaftar, berkasDokumen } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Kode pendaftaran diperlukan" }, { status: 400 });
    }

    const data = await db.select()
      .from(pendaftar)
      .where(eq(pendaftar.kodePendaftaran, code))
      .get();

    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    // Fetch berkas for photo
    const berkas = await db.query.berkasDokumen.findFirst({
      where: eq(berkasDokumen.pendaftarId, data.id)
    });

    // Include settings info for PDF generation
    const settings = await db.query.pengaturanWeb.findFirst();

    return NextResponse.json({
      ...data,
      pasFotoUrl: berkas?.pasFotoUrl,
      heroBadge: settings?.heroBadge || "PENERIMAAN SANTRI BARU 2026/2027"
    });
  } catch (error: any) {
    console.error("PPDB Status API Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data status" }, { status: 500 });
  }
}

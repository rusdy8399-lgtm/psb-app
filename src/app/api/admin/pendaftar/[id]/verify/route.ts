import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendaftar } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";


export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await db.update(pendaftar)
      .set({ status: "Terkonfirmasi" })
      .where(eq(pendaftar.id, id));
      
    return NextResponse.json({ success: true, message: "Pendaftar berhasil dikonfirmasi" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses verifikasi" }, { status: 500 });
  }
}

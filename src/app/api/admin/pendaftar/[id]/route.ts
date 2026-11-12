import { db } from "@/lib/db";
import { pendaftar, berkasDokumen, ortuWakil } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFromStorage } from "@/lib/upload";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    console.log(`Admin API: Deleting pendaftar ID: ${id}`);

    // 2. Fetch file URLs for cleanup
    const berkas = await db.query.berkasDokumen.findFirst({
      where: eq(berkasDokumen.pendaftarId, id),
    });

    if (berkas) {
      console.log("Admin API: Cleaning up storage files...");
      
      const fileUrls = [
        berkas.kkUrl,
        berkas.aktaKelahiranUrl,
        berkas.ijazahUrl,
        berkas.pasFotoUrl,
        berkas.buktiPembayaranUrl
      ];

      // Delete files in parallel (don't block for each one, but wait for all)
      await Promise.all(fileUrls.map(url => deleteFromStorage(url)));
    }

    // 3. Delete from database (explicitly delete child tables for SQLite data integrity)
    await db.delete(ortuWakil).where(eq(ortuWakil.pendaftarId, id));
    await db.delete(berkasDokumen).where(eq(berkasDokumen.pendaftarId, id));
    await db.delete(pendaftar).where(eq(pendaftar.id, id));

    console.log(`Admin API: Successfully deleted pendaftar ${id}`);
    
    revalidatePath("/dashboard/pendaftar");

    return NextResponse.json({ 
      success: true, 
      message: "Data pendaftaran berhasil dihapus beserta berkas pendukungnya." 
    });
  } catch (error: any) {
    console.error("Admin API Delete Error:", error);
    return NextResponse.json({ 
      error: "Gagal menghapus data pendaftaran", 
      details: error.message 
    }, { status: 500 });
  }
}

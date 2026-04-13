import { db } from "@/lib/db";
import { pendaftar, berkasDokumen } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFromFirebase } from "@/lib/upload";

export const dynamic = "force-dynamic";


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    console.log(`Admin API: Deleting pendaftar ID: ${id}`);

    // 1. Fetch file URLs for cleanup
    const berkas = await db.query.berkasDokumen.findFirst({
      where: eq(berkasDokumen.pendaftarId, id),
    });

    if (berkas) {
      console.log("Admin API: Cleaning up Firebase files...");
      
      const fileUrls = [
        berkas.kkUrl,
        berkas.aktaKelahiranUrl,
        berkas.ijazahUrl,
        berkas.pasFotoUrl,
        berkas.buktiPembayaranUrl
      ];

      // Delete files in parallel (don't block for each one, but wait for all)
      await Promise.all(fileUrls.map(url => deleteFromFirebase(url)));
    }

    // 2. Delete from database (Cascading will handle ortu_wakil and berkas_dokumen)
    await db.delete(pendaftar).where(eq(pendaftar.id, id));

    console.log(`Admin API: Successfully deleted pendaftar ${id}`);
    
    revalidatePath("/dashboard/pendaftar");

    return NextResponse.json({ 
      success: true, 
      message: "Data pendaftaran berhasil dihapus beserta berkas pendukungnya." 
    });
  } catch (error: any) {
    console.error("Admin API: Delete FAILED", error);
    return NextResponse.json(
      { error: "Gagal menghapus data pendaftaran", details: error.message },
      { status: 500 }
    );
  }
}

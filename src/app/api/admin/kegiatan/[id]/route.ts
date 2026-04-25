import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { kegiatan } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";

export const dynamic = "force-dynamic";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    let updateData = { ...body };
    
    if (body.judul) {
      let baseSlug = slugify(body.judul);
      let finalSlug = baseSlug;
      let counter = 1;
      
      while (true) {
         // check if slug exists for OTHER items
         const existing = await db.query.kegiatan.findFirst({ 
           where: and(eq(kegiatan.slug, finalSlug), ne(kegiatan.id, id)) 
         });
         if (!existing) break;
         finalSlug = `${baseSlug}-${counter}`;
         counter++;
      }
      updateData.slug = finalSlug;
    }
    
    await db.update(kegiatan)
      .set(updateData)
      .where(eq(kegiatan.id, id));
      
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update kegiatan" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(kegiatan).where(eq(kegiatan.id, id));
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete kegiatan" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { pengaturanWeb } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// GET settings (always first or only row)
export async function GET() {
  try {
    const settings = await db.query.pengaturanWeb.findFirst();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST/PUT settings (always updating the first row)
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const settings = await db.query.pengaturanWeb.findFirst();
    
    if (settings) {
      await db.update(pengaturanWeb)
        .set(body)
        .where(eq(pengaturanWeb.id, settings.id));
    } else {
      await db.insert(pengaturanWeb).values({
        id: uuidv4(),
        ...body,
      });
    }

    // Safe revalidation: prevents server error if revalidate store is unavailable
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/kontak");
      revalidatePath("/pendaftaran");
      revalidatePath("/download-brosur");
      revalidatePath("/fasilitas");
      revalidatePath("/kegiatan");
      revalidatePath("/galeri");
    } catch (revalidateErr) {
      console.warn("Revalidation warning (safe to ignore):", revalidateErr);
    }

    return NextResponse.json({ success: true, updated: true });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

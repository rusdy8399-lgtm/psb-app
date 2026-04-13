import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { pengaturanWeb } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";


// GET settings (always first or only row)
export async function GET() {
  try {
    const settings = await db.query.pengaturanWeb.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST/PUT settings (always updating the first row)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = await db.query.pengaturanWeb.findFirst();
    
    if (settings) {
      await db.update(pengaturanWeb)
        .set(body)
        .where(eq(pengaturanWeb.id, settings.id));
      revalidatePath("/", "layout");
      return NextResponse.json({ success: true, updated: true });
    } else {
      // In case no seed data exists yet
      return NextResponse.json({ error: "No settings found to update. Seed DB first." }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

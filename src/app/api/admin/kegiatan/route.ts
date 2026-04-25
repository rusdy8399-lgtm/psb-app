import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { kegiatan } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// GET all kegiatan
export async function GET() {
  try {
    const data = await db.query.kegiatan.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch kegiatan" }, { status: 500 });
  }
}

// POST new kegiatan
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    let baseSlug = body.judul ? slugify(body.judul) : uuidv4();
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Check if slug exists
    while (true) {
       const existing = await db.query.kegiatan.findFirst({ where: eq(kegiatan.slug, finalSlug) });
       if (!existing) break;
       finalSlug = `${baseSlug}-${counter}`;
       counter++;
    }

    const newData = {
      id: uuidv4(),
      slug: finalSlug,
      ...body,
    };
    await db.insert(kegiatan).values(newData);
    revalidatePath("/", "layout");
    return NextResponse.json(newData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create kegiatan" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { galeri } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";


// GET all galeri
export async function GET() {
  try {
    const data = await db.query.galeri.findMany({
      orderBy: [desc(galeri.id)],
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch galeri" }, { status: 500 });
  }
}

// POST new galeri
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newData = {
      id: uuidv4(),
      ...body,
    };
    await db.insert(galeri).values(newData);
    revalidatePath("/", "layout");
    return NextResponse.json(newData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create galeri" }, { status: 500 });
  }
}

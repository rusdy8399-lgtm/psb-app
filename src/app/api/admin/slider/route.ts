import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { heroSection } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";


// GET all sliders
export async function GET() {
  try {
    const sliders = await db.query.heroSection.findMany({
      orderBy: [asc(heroSection.order)],
    });
    return NextResponse.json(sliders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sliders" }, { status: 500 });
  }
}

// POST new slider
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSlider = {
      id: uuidv4(),
      ...body,
      order: body.order || 0,
      isActive: body.isActive ?? true,
    };
    
    await db.insert(heroSection).values(newSlider);
    revalidatePath("/", "layout");
    return NextResponse.json(newSlider);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create slider" }, { status: 500 });
  }
}

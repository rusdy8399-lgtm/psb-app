import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { fasilitas } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";


// GET all fasilitas
export async function GET() {
  try {
    const data = await db.query.fasilitas.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch fasilitas" }, { status: 500 });
  }
}

// POST new fasilitas
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newData = {
      id: uuidv4(),
      ...body,
    };
    await db.insert(fasilitas).values(newData);
    revalidatePath("/fasilitas");
    return NextResponse.json(newData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create fasilitas" }, { status: 500 });
  }
}

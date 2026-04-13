import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendaftar } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";


// GET all pendaftar (for export)
export async function GET(req: NextRequest) {
  try {
    const data = await db.query.pendaftar.findMany({
      orderBy: [desc(pendaftar.createdAt)],
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pendaftar" }, { status: 500 });
  }
}

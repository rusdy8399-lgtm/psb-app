import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check if ANY user already exists in the database
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(user);
    const userCount = totalUsers[0]?.count || 0;

    if (userCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Setup administrator sudah selesai. Akun admin sudah tersedia." 
        }, 
        { status: 403 }
      );
    }

    const adminEmail = process.env.ADMIN_SETUP_EMAIL || "admin@balibinainsani.sch.id";
    const adminPassword = process.env.ADMIN_SETUP_PASSWORD || "admin123";

    // Create initial admin user using better-auth internal API
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Administrator",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Akun administrator berhasil dibuat. Silakan login di /login.",
      email: adminEmail,
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ 
      error: "Failed to create admin", 
      details: error.message 
    }, { status: 500 });
  }
}

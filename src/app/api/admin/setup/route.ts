import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const adminEmail = "admin@balibinainsani.sch.id";
    const adminPassword = "admin123";

    // Check if admin already exists
    const existingAdmin = await db.query.user.findFirst({
      where: eq(user.email, adminEmail),
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin already exists", 
        email: adminEmail 
      });
    }

    // Create admin user using better-auth internal API
    await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Administrator",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin account created successfully",
      email: adminEmail,
      password: adminPassword
    });
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json({ 
      error: "Failed to create admin", 
      details: error.message 
    }, { status: 500 });
  }
}

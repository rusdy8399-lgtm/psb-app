import { NextRequest, NextResponse } from "next/server";
import { uploadToFirebase } from "@/lib/upload";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Upload to Firebase Storage
    const url = await uploadToFirebase(file, "admin-uploads");

    console.log(`File uploaded successfully to Firebase: ${url}`);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/upload";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "File tidak ditemukan atau format tidak valid" },
        { status: 400 }
      );
    }

    // Upload to primary storage (Cloudflare R2, fallback to Firebase)
    const url = await uploadToStorage(file as Blob, "admin-uploads");

    console.log(`File uploaded successfully: ${url}`);
    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah file";
    console.error("Upload error:", error);
    return NextResponse.json({ error: message, message }, { status: 500 });
  }
}

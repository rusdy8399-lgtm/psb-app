import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/upload";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access: login required" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "File tidak ditemukan atau format tidak valid" },
        { status: 400 }
      );
    }

    const blobFile = file as Blob;

    // 2. Validate file size
    if (blobFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file melebihi batas maksimal 25 MB" },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    if (blobFile.type && !ALLOWED_MIME_TYPES.includes(blobFile.type.toLowerCase())) {
      return NextResponse.json(
        { error: "Format file tidak diizinkan. Hanya gambar, video, dan PDF yang diperbolehkan." },
        { status: 400 }
      );
    }

    // Upload to storage (Cloudflare R2)
    const url = await uploadToStorage(blobFile, "admin-uploads");

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah file";
    console.error("Upload error:", error);
    return NextResponse.json({ error: message, message }, { status: 500 });
  }
}

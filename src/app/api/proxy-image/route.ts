import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Safety: only allow certain domains if necessary, but for now we proxy all
    // to ensure accessibility of various storage providers (Firebase, etc.)
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error: any) {
    console.error("Image Proxy Error:", error);
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}

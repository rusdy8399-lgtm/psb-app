import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAllowedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  // Explicitly block local and private network ranges
  if (
    lower === "localhost" ||
    lower === "127.0.0.1" ||
    lower === "0.0.0.0" ||
    lower === "::1" ||
    lower.startsWith("10.") ||
    lower.startsWith("192.168.") ||
    lower.startsWith("169.254.") ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal")
  ) {
    return false;
  }

  // Check 172.16.0.0 - 172.31.255.255
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)) {
    return false;
  }

  // Whitelisted trusted external media domains
  const allowedExactHosts = [
    "images.unsplash.com",
    "firebasestorage.googleapis.com",
    "pesantrenbali.my.id",
    "www.pesantrenbali.my.id",
  ];

  if (allowedExactHosts.includes(lower)) {
    return true;
  }

  // Whitelist Cloudflare R2 domains
  if (lower.endsWith(".r2.dev") || lower.endsWith(".r2.cloudflarestorage.com")) {
    return true;
  }

  // Custom R2 Public URL domain if configured
  if (process.env.R2_PUBLIC_URL) {
    try {
      const customHost = new URL(process.env.R2_PUBLIC_URL).hostname.toLowerCase();
      if (lower === customHost) {
        return true;
      }
    } catch {
      // ignore
    }
  }

  return false;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
    }

    if (!isAllowedHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: "Domain is not authorized for proxy" },
        { status: 403 }
      );
    }
    
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(10000), // 10s timeout to prevent hanging
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    
    // Only accept valid image or video content types
    if (!contentType.startsWith("image/") && !contentType.startsWith("video/")) {
      return NextResponse.json({ error: "Invalid media Content-Type" }, { status: 400 });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200", // Cache for 24h
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("Image Proxy Error:", error);
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}

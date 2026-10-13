import { NextRequest, NextResponse } from "next/server";
import { getR2Client } from "@/lib/r2";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

export const dynamic = "force-dynamic";

function getBucketName(): string {
  const bucket = (process.env.R2_BUCKET_NAME || "").trim().replace(/^["']|["']$/g, "");
  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is not set");
  }
  return bucket;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    if (!path || path.length === 0) {
      return new NextResponse("File path missing", { status: 400 });
    }

    const key = path.join("/");
    const bucket = getBucketName();
    const client = getR2Client();

    // Check Range header for PDF streaming/seeking
    const rangeHeader = req.headers.get("range");

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: rangeHeader || undefined,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return new NextResponse("File body is empty", { status: 404 });
    }

    const stream = response.Body.transformToWebStream();
    const headers = new Headers();

    const contentType = response.ContentType || "application/octet-stream";
    headers.set("Content-Type", contentType);

    if (response.ContentLength !== undefined) {
      headers.set("Content-Length", response.ContentLength.toString());
    }

    if (response.ContentRange) {
      headers.set("Content-Range", response.ContentRange);
    }

    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // Allow inline preview in iframe and browser
    const filename = key.split("/").pop() || "dokumen.pdf";
    headers.set("Content-Disposition", `inline; filename="${filename}"`);

    const status = rangeHeader && response.ContentRange ? 206 : 200;

    return new NextResponse(stream as unknown as BodyInit, {
      status,
      headers,
    });
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string };
    if (err?.name === "NoSuchKey") {
      return new NextResponse("Berkas tidak ditemukan di Cloudflare R2", { status: 404 });
    }
    console.error("Cloudflare R2 Media Proxy Error:", error);
    return new NextResponse("Gagal mengakses berkas dari storage", { status: 500 });
  }
}

export async function HEAD(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    if (!path || path.length === 0) {
      return new NextResponse(null, { status: 400 });
    }

    const key = path.join("/");
    const bucket = getBucketName();
    const client = getR2Client();

    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await client.send(command);

    const headers = new Headers();
    if (response.ContentType) {
      headers.set("Content-Type", response.ContentType);
    }
    if (response.ContentLength !== undefined) {
      headers.set("Content-Length", response.ContentLength.toString());
    }
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(null, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    const err = error as { name?: string };
    if (err?.name === "NotFound" || err?.name === "NoSuchKey") {
      return new NextResponse(null, { status: 404 });
    }
    return new NextResponse(null, { status: 500 });
  }
}

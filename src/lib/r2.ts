import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

let r2ClientInstance: S3Client | null = null;

function cleanEnv(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "");
}

/**
 * Checks whether all required Cloudflare R2 environment variables are defined.
 */
export function isR2Configured(): boolean {
  const accountId = cleanEnv(process.env.R2_ACCOUNT_ID);
  const accessKeyId = cleanEnv(process.env.R2_ACCESS_KEY_ID);
  const secretAccessKey = cleanEnv(process.env.R2_SECRET_ACCESS_KEY);
  const bucket = cleanEnv(process.env.R2_BUCKET_NAME);

  return Boolean(accountId && accessKeyId && secretAccessKey && bucket);
}

/**
 * Returns a singleton instance of the S3Client configured for Cloudflare R2.
 */
export function getR2Client(): S3Client {
  if (!r2ClientInstance) {
    const accountId = cleanEnv(process.env.R2_ACCOUNT_ID);
    const accessKeyId = cleanEnv(process.env.R2_ACCESS_KEY_ID);
    const secretAccessKey = cleanEnv(process.env.R2_SECRET_ACCESS_KEY);

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "Cloudflare R2 is not configured. Missing R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY."
      );
    }

    r2ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return r2ClientInstance;
}

/**
 * Generates the public URL for an object stored in R2.
 */
export function getR2PublicUrl(key: string): string {
  const publicBaseUrl = cleanEnv(process.env.R2_PUBLIC_URL).replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");

  if (publicBaseUrl) {
    return `${publicBaseUrl}/${cleanKey}`;
  }

  // Fallback endpoint if public URL/domain is not specified
  const accountId = cleanEnv(process.env.R2_ACCOUNT_ID);
  const bucket = cleanEnv(process.env.R2_BUCKET_NAME);
  return `https://${bucket}.${accountId}.r2.cloudflarestorage.com/${cleanKey}`;
}

/**
 * Extracts the object key from a full public R2 URL or returns the key directly.
 */
export function extractR2Key(keyOrUrl: string): string {
  if (!keyOrUrl) return "";

  const publicBaseUrl = cleanEnv(process.env.R2_PUBLIC_URL).replace(/\/+$/, "");
  if (publicBaseUrl && keyOrUrl.startsWith(publicBaseUrl)) {
    return keyOrUrl.replace(`${publicBaseUrl}/`, "").replace(/^\/+/, "");
  }

  // Handle standard URL pattern
  try {
    const parsed = new URL(keyOrUrl);
    return parsed.pathname.replace(/^\/+/, "");
  } catch {
    // If not a URL, it's already a key path
    return keyOrUrl.replace(/^\/+/, "");
  }
}

/**
 * Uploads a buffer or byte array directly to Cloudflare R2 bucket.
 */
export async function uploadBufferToR2(params: {
  buffer: Buffer | Uint8Array;
  key: string;
  contentType: string;
}): Promise<string> {
  const bucket = cleanEnv(process.env.R2_BUCKET_NAME);
  if (!bucket) {
    throw new Error("Cloudflare R2 Bucket Name (R2_BUCKET_NAME) is not set.");
  }

  const client = getR2Client();
  const bodyBuffer = Buffer.isBuffer(params.buffer)
    ? params.buffer
    : Buffer.from(params.buffer);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    Body: bodyBuffer,
    ContentType: params.contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await client.send(command);
  return getR2PublicUrl(params.key);
}

/**
 * Deletes an object from Cloudflare R2 bucket given its key or public URL.
 */
export async function deleteObjectFromR2(keyOrUrl: string): Promise<void> {
  const bucket = cleanEnv(process.env.R2_BUCKET_NAME);
  if (!bucket) {
    throw new Error("Cloudflare R2 Bucket Name (R2_BUCKET_NAME) is not set.");
  }

  const key = extractR2Key(keyOrUrl);
  if (!key) return;

  const client = getR2Client();
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

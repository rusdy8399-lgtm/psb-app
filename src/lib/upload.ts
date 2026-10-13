import { v4 as uuidv4 } from "uuid";
import { isR2Configured, uploadBufferToR2, deleteObjectFromR2 } from "./r2";

/**
 * Uploads a file to Cloudflare R2 storage.
 * @param file The file or blob object (from FormData)
 * @param folder The folder path in the bucket (e.g., 'ppdb/kk', 'admin-uploads')
 * @returns Promise<string> The public download URL
 */
export async function uploadToStorage(file: File | Blob, folder: string): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("File kosong atau tidak valid");
  }

  // Safe file extension detection (supports File, Blob, and missing names)
  let extension = "jpg";
  const fileNameCandidate = (file as { name?: string }).name;
  if (fileNameCandidate && typeof fileNameCandidate === "string" && fileNameCandidate.includes(".")) {
    const ext = fileNameCandidate.split(".").pop();
    if (ext && ext !== "blob") {
      extension = ext.toLowerCase();
    }
  } else if (file.type) {
    const sub = file.type.split("/")[1];
    if (sub) {
      extension = sub === "jpeg" ? "jpg" : sub.split(";")[0].split("+")[0].toLowerCase();
    }
  }

  const fileName = `${uuidv4()}.${extension}`;
  const fullPath = `${folder}/${fileName}`;

  // Read file data
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = file.type || "application/octet-stream";

  // Check if Cloudflare R2 is configured
  if (isR2Configured()) {
    const displayName = (file as { name?: string }).name || fileName;
    console.log(`Cloudflare R2 Upload: Starting for ${displayName} -> ${fullPath} (${file.size} bytes)`);
    try {
      const publicUrl = await uploadBufferToR2({
        buffer,
        key: fullPath,
        contentType,
      });
      console.log(`Cloudflare R2 Upload: Success -> ${publicUrl}`);
      return publicUrl;
    } catch (error: unknown) {
      console.error(`Cloudflare R2 Upload: FAILED for ${displayName}`, error);
      throw error;
    }
  }

  throw new Error(
    "Layanan Cloudflare R2 belum terkonfigurasi. Pastikan R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, dan R2_BUCKET_NAME sudah diisi di Environment Variables."
  );
}

/**
 * Deletes a file from Cloudflare R2 storage given its URL.
 * @param url The public URL of the file
 */
export async function deleteFromStorage(url: string | null | undefined): Promise<void> {
  if (!url) {
    return;
  }

  // Check if the URL belongs to Cloudflare R2
  const r2PublicUrl = process.env.R2_PUBLIC_URL || "";
  const isR2Url =
    (r2PublicUrl && url.startsWith(r2PublicUrl)) ||
    url.includes(".r2.dev") ||
    url.includes(".r2.cloudflarestorage.com");

  if (isR2Url) {
    try {
      console.log(`Cloudflare R2 Delete: Deleting ${url}`);
      await deleteObjectFromR2(url);
      console.log(`Cloudflare R2 Delete: Success for ${url}`);
      return;
    } catch (error: unknown) {
      console.error(`Cloudflare R2 Delete: FAILED for ${url}`, error);
      return;
    }
  }

  if (url.includes("firebasestorage.googleapis.com")) {
    console.log(`Storage Delete: Skipping legacy Firebase URL: ${url}`);
    return;
  }

  console.log(`Storage Delete: Skipping unrecognized URL scheme: ${url}`);
}

// Aliases for seamless backward compatibility with existing codebase
export const uploadToFirebase = uploadToStorage;
export const deleteFromFirebase = deleteFromStorage;

/**
 * Client-side file processing and upload utilities.
 * Designed to prevent browser UI freezing, memory leaks, and unresponsive popups.
 */

/**
 * Fast, non-blocking single-pass image resize using native HTML5 Canvas.
 * Unlike aggressive iterative compression libraries, this finishes in ~50ms
 * without freezing the browser main thread.
 */
export async function fastPrepareImage(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<File> {
  // 1. Non-images (PDFs, docs) are returned immediately as-is
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // 2. SVGs or GIFs should never be rasterized or resized
  if (file.type.includes("svg") || file.type.includes("gif")) {
    return file;
  }

  // 3. Small files (< 1.5 MB) upload instantly to R2; no CPU overhead needed
  if (file.size <= 1.5 * 1024 * 1024) {
    return file;
  }

  // 4. For large camera/phone photos (> 1.5 MB), do a fast single-pass resize
  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;
        if (width <= maxDimension && height <= maxDimension) {
          // Resolution is already reasonable, keep original
          resolve(file);
          return;
        }

        // Calculate aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG (or PNG if original has alpha)
        const targetType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compressed blob is somehow larger or failed, return original
              resolve(file);
            } else {
              const extension = targetType === "image/png" ? ".png" : ".jpg";
              const cleanName = file.name.replace(/\.[^/.]+$/, "") + extension;
              resolve(new File([blob], cleanName, { type: targetType }));
            }
          },
          targetType,
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file); // Fallback to original
      };

      img.src = objectUrl;
    } catch {
      resolve(file); // Safe fallback
    }
  });
}

/**
 * Uploads a file to /api/upload with timeout and cancellation support.
 */
export async function uploadClientFile(
  file: File,
  options?: {
    signal?: AbortSignal;
    timeoutMs?: number;
  }
): Promise<string> {
  // Pre-process image with fast canvas resize if needed
  const processedFile = await fastPrepareImage(file);

  // Maximum allowed payload for Vercel Serverless Function is 4.5MB
  const maxBytes = 4.4 * 1024 * 1024;
  if (processedFile.size > maxBytes) {
    throw new Error(
      `Ukuran berkas (${(processedFile.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas upload 4.5 MB. Mohon pilih berkas yang lebih kecil.`
    );
  }

  const timeoutMs = options?.timeoutMs || 35000; // 35 seconds default timeout
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new Error("Waktu unggah habis (koneksi lambat)."));
  }, timeoutMs);

  // Combine external cancellation signal with timeout
  const combinedSignal = options?.signal
    ? AbortSignal.any([options.signal, timeoutController.signal])
    : timeoutController.signal;

  const uploadData = new FormData();
  uploadData.append("file", processedFile, processedFile.name || "media.jpg");

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          errorData?.error ||
          `Gagal mengunggah berkas (${response.status})`
      );
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error("URL berkas tidak ditemukan dalam respon server");
    }

    return data.url;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Proses unggah dibatalkan.");
    }
    throw error;
  }
}

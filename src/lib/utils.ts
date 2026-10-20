import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  return (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".ogg") ||
    cleanUrl.endsWith(".mov") ||
    cleanUrl.endsWith(".m4v") ||
    url.includes("video/mp4") ||
    url.includes("video/webm")
  );
}

export function resolveMediaUrl(urlOrKey?: string | null): string {
  if (!urlOrKey || typeof urlOrKey !== "string") return "";

  // Already an internal media proxy URL
  if (urlOrKey.startsWith("/api/media/")) {
    return urlOrKey;
  }

  // Rewrite blocked Cloudflare R2 dev URLs to reliable internal proxy
  if (urlOrKey.includes(".r2.dev") || urlOrKey.includes(".r2.cloudflarestorage.com")) {
    try {
      const parsed = new URL(urlOrKey);
      const cleanKey = parsed.pathname.replace(/^\/+/, "");
      return `/api/media/${cleanKey}`;
    } catch {
      // ignore parsing error
    }
  }

  if (urlOrKey.startsWith("admin-uploads/") || urlOrKey.startsWith("ppdb/")) {
    return `/api/media/${urlOrKey}`;
  }

  return urlOrKey;
}


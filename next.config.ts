import type { NextConfig } from "next";

const remotePatterns: Array<{
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname?: string;
}> = [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https",
      hostname: "api.dicebear.com",
    },
    {
      protocol: "https",
      hostname: "firebasestorage.googleapis.com",
    },
    {
      protocol: "https",
      hostname: "**.r2.dev",
    },
    {
      protocol: "https",
      hostname: "**.r2.cloudflarestorage.com",
    },
  ];

// Add custom domain from R2_PUBLIC_URL if present and not already matched
if (process.env.R2_PUBLIC_URL) {
  try {
    const customHost = new URL(process.env.R2_PUBLIC_URL).hostname;
    if (
      customHost &&
      !remotePatterns.some((pattern) => pattern.hostname === customHost)
    ) {
      remotePatterns.push({
        protocol: "https",
        hostname: customHost,
      });
    }
  } catch {
    // ignore invalid URL
  }
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [25, 50, 75, 80, 85, 90, 100],
    remotePatterns,
  },
};

export default nextConfig;
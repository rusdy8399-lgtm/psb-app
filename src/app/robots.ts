import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pesantrenbali.my.id";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/login",
        "/api/",
        "/pendaftaran/sukses",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

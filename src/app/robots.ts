import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl =
    rawSiteUrl && !rawSiteUrl.includes("localhost") && !rawSiteUrl.includes("127.0.0.1")
      ? rawSiteUrl
      : "https://www.pesantrenbali.my.id";

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

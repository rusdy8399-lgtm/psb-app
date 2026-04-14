import { MetadataRoute } from "next";
import { getKegiatanList } from "@/lib/data-fetching";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://project-98lnv.vercel.app";

  // Fetch dynamic activities
  const kegiatanItems = await getKegiatanList();
  const kegiatanUrls = kegiatanItems.map((item) => ({
    url: `${baseUrl}/kegiatan/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/kegiatan`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/brosur`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ppdb`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...kegiatanUrls];
}

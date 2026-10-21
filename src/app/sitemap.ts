import { MetadataRoute } from "next";
import { getKegiatanList, getGaleriList } from "@/lib/data-fetching";

export const revalidate = 3600; // Cache sitemap for 1 hour

function parseValidDate(dateStr: string | null | undefined): Date | undefined {
  if (!dateStr) return undefined;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pesantrenbali.my.id";

  // Safely fetch dynamic activities
  let kegiatanItems: Awaited<ReturnType<typeof getKegiatanList>> = [];
  try {
    kegiatanItems = await getKegiatanList();
  } catch (err) {
    console.error("Failed to fetch kegiatan for sitemap:", err);
  }

  // Safely fetch gallery items
  let galeriItems: Awaited<ReturnType<typeof getGaleriList>> = [];
  try {
    galeriItems = await getGaleriList();
  } catch (err) {
    console.error("Failed to fetch galeri for sitemap:", err);
  }

  // Determine latest publication dates for list pages
  const sortedKegiatanDates = kegiatanItems
    .map((item) => parseValidDate(item.tanggal))
    .filter((d): d is Date => Boolean(d))
    .sort((a, b) => b.getTime() - a.getTime());
  const latestKegiatanDate = sortedKegiatanDates[0];

  const sortedGaleriDates = galeriItems
    .map((item) => {
      if (item.createdAt) {
        const d = new Date(item.createdAt);
        if (!isNaN(d.getTime())) return d;
      }
      return parseValidDate(item.tanggal);
    })
    .filter((d): d is Date => Boolean(d))
    .sort((a, b) => b.getTime() - a.getTime());
  const latestGaleriDate = sortedGaleriDates[0];

  // Dynamic news/activity detail URLs
  const kegiatanUrls: MetadataRoute.Sitemap = kegiatanItems
    .filter((item) => Boolean(item.slug || item.id))
    .map((item) => {
      const slugOrId = encodeURIComponent(item.slug || item.id);
      const articleDate = parseValidDate(item.tanggal);
      return {
        url: `${baseUrl}/kegiatan/${slugOrId}`,
        ...(articleDate ? { lastModified: articleDate } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

  // Valid public pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      ...(latestKegiatanDate ? { lastModified: latestKegiatanDate } : {}),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kegiatan`,
      ...(latestKegiatanDate ? { lastModified: latestKegiatanDate } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pendaftaran`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/download-brosur`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fasilitas`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/galeri`,
      ...(latestGaleriDate ? { lastModified: latestGaleriDate } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kontak`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [...staticUrls, ...kegiatanUrls];
}

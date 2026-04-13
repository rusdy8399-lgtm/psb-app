import { cache } from "react";
import { db } from "./db";
import { heroSection, fasilitas, kegiatan, galeri } from "./db/schema";
import { eq, asc, desc } from "drizzle-orm";

/**
 * Request-level deduplicated fetching service.
 * Using React cache() to ensure the same DB query isn't executed twice
 * during the same server-rendering lifecycle.
 */

export const getSiteSettings = cache(async () => {
  return await db.query.pengaturanWeb.findFirst();
});

export const getActiveSliders = cache(async () => {
  return await db.query.heroSection.findMany({
    where: eq(heroSection.isActive, true),
    orderBy: [asc(heroSection.order)],
  });
});

export const getFasilitas = cache(async () => {
  return await db.query.fasilitas.findMany();
});

export const getKegiatanList = cache(async () => {
  return await db.query.kegiatan.findMany({
    orderBy: [desc(kegiatan.tanggal)],
  });
});

export const getGaleriList = cache(async () => {
  return await db.query.galeri.findMany({
    orderBy: [desc(galeri.tanggal)],
  });
});

export const getKegiatanById = cache(async (id: string) => {
  return await db.query.kegiatan.findFirst({
    where: eq(kegiatan.id, id),
  });
});

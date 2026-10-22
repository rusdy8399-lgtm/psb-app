import { cache } from "react";
import { db } from "./db";
import { heroSection, fasilitas, kegiatan, galeri } from "./db/schema";
import { eq, asc, desc, or } from "drizzle-orm";

/**
 * Request-level deduplicated fetching service.
 * Using React cache() to ensure the same DB query isn't executed twice
 * during the same server-rendering lifecycle.
 */

export const getSiteSettings = cache(async () => {
  try {
    return await db.query.pengaturanWeb.findFirst();
  } catch (error) {
    console.warn("⚠️ getSiteSettings fallback:", error);
    return null;
  }
});

export const getActiveSliders = cache(async () => {
  try {
    return await db.query.heroSection.findMany({
      where: eq(heroSection.isActive, true),
      orderBy: [asc(heroSection.order)],
    });
  } catch (error) {
    console.warn("⚠️ getActiveSliders fallback:", error);
    return [];
  }
});

export const getFasilitas = cache(async () => {
  try {
    return await db.query.fasilitas.findMany();
  } catch (error) {
    console.warn("⚠️ getFasilitas fallback:", error);
    return [];
  }
});

export const getKegiatanList = cache(async () => {
  try {
    return await db.query.kegiatan.findMany({
      orderBy: [desc(kegiatan.tanggal)],
    });
  } catch (error) {
    console.warn("⚠️ getKegiatanList fallback:", error);
    return [];
  }
});

export const getGaleriList = cache(async () => {
  try {
    return await db.query.galeri.findMany({
      orderBy: [desc(galeri.tanggal)],
    });
  } catch (error) {
    console.warn("⚠️ getGaleriList fallback:", error);
    return [];
  }
});

export const getKegiatanById = cache(async (id: string) => {
  try {
    return await db.query.kegiatan.findFirst({
      where: eq(kegiatan.id, id),
    });
  } catch (error) {
    console.warn("⚠️ getKegiatanById fallback:", error);
    return null;
  }
});

export const getKegiatanBySlug = cache(async (slugStr: string) => {
  try {
    return await db.query.kegiatan.findFirst({
      where: or(eq(kegiatan.slug, slugStr), eq(kegiatan.id, slugStr)),
    });
  } catch (error) {
    console.warn("⚠️ getKegiatanBySlug fallback:", error);
    return null;
  }
});

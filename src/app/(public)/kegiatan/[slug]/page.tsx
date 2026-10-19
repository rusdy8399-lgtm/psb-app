import { getKegiatanBySlug, getKegiatanList } from "@/lib/data-fetching";
import { notFound } from "next/navigation";
import { ArrowRight, Images } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import nextDynamic from "next/dynamic";
import { Metadata } from "next";
import { Fragment } from "react";

export const revalidate = 1800; // Cache for 30 minutes

const ShareButtons = nextDynamic(
  () => import("@/components/public/ShareButtons").then((mod) => mod.ShareButtons)
);

interface Props {
  params: Promise<{ slug: string }>;
}

// Helper untuk format tanggal Indonesia
function formatIndonesianDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

// Helper untuk penentuan label kategori berita secara cerdas
function getCategory(title: string): string {
  const lower = title.toLowerCase();
  if (
    lower.includes("prestasi") ||
    lower.includes("juara") ||
    lower.includes("lomba") ||
    lower.includes("cup") ||
    lower.includes("kejuaraan")
  ) {
    return "Prestasi Santri";
  }
  if (lower.includes("alumni") || lower.includes("ipk") || lower.includes("universitas")) {
    return "Kabar Alumni";
  }
  if (
    lower.includes("takhrij") ||
    lower.includes("wisuda") ||
    lower.includes("kelulusan") ||
    lower.includes("angkatan")
  ) {
    return "Agenda Pesantren";
  }
  if (
    lower.includes("kajian") ||
    lower.includes("ramadhan") ||
    lower.includes("tarbiyah") ||
    lower.includes("santri")
  ) {
    return "Kegiatan Santri";
  }
  return "Kabar Pesantren";
}

// Generate Dynamic Metadata for Social Sharing (OG Tags)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getKegiatanBySlug(slug);

  if (!item) return { title: "Berita Tidak Ditemukan" };

  return {
    title: `${item.judul} | Pondok Pesantren Bali Bina Insani`,
    description: item.deskripsi.substring(0, 160),
    openGraph: {
      title: item.judul,
      description: item.deskripsi.substring(0, 160),
      images: item.fotoUrl ? [item.fotoUrl] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: item.judul,
      description: item.deskripsi.substring(0, 160),
      images: item.fotoUrl ? [item.fotoUrl] : [],
    },
  };
}

export default async function KegiatanDetailPage({ params }: Props) {
  const { slug } = await params;

  // Ambil artikel yang aktif dan seluruh daftar kegiatan
  const [item, allKegiatan] = await Promise.all([
    getKegiatanBySlug(slug),
    getKegiatanList(),
  ]);

  if (!item) {
    notFound();
  }

  // Filter agar artikel yang sedang dibuka tidak muncul di sidebar / berita terkait
  const otherArticles = allKegiatan.filter(
    (k) => k.id !== item.id && k.slug !== item.slug
  );

  // Berita Terbaru untuk Sidebar (5 berita teratas)
  const latestArticles = otherArticles.slice(0, 5);

  // Berita Terkait (maksimal 3 kartu, prioritaskan kategori yang sama)
  const currentCategory = getCategory(item.judul);
  const sameCategoryArticles = otherArticles.filter(
    (k) => getCategory(k.judul) === currentCategory
  );
  const diffCategoryArticles = otherArticles.filter(
    (k) => getCategory(k.judul) !== currentCategory
  );
  const relatedArticles = [...sameCategoryArticles, ...diffCategoryArticles].slice(0, 3);

  // Artikel rekomendasi untuk selingan "Baca Juga :" di dalam isi berita
  const recommendation = relatedArticles[0] || latestArticles[0];

  const formattedDate = formatIndonesianDate(item.tanggal);
  const articleCategory = getCategory(item.judul);

  // Pecah paragraf isi berita
  const paragraphs = item.deskripsi
    .split("\n")
    .map((para) => para.trim())
    .filter(Boolean);

  return (
    <div className="bg-white min-h-screen py-6 md:py-10 font-sans text-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 1. Breadcrumbs Navigasi ── */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center text-xs sm:text-sm text-slate-500 gap-2">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            Beranda
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/kegiatan" className="hover:text-emerald-700 transition-colors">
            Kabar & Kegiatan
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400 truncate max-w-[220px] sm:max-w-md">
            {item.judul}
          </span>
        </nav>

        {/* ── 2. Layout Portal Media 2 Kolom (Desktop: ~68% Artikel, ~32% Sidebar) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ═══════════ KOLOM UTAMA ARTIKEL BERITA (8 Kolom) ═══════════ */}
          <article className="lg:col-span-8 flex flex-col">
            
            {/* Header: Judul Berita Besar & Tegas */}
            <header className="mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-extrabold text-slate-900 leading-[1.25] tracking-tight mb-3">
                {item.judul}
              </h1>

              {/* Meta: Tanggal & Penulis / Redaksi */}
              <div className="text-xs sm:text-sm text-slate-500 space-y-1 font-sans border-b border-slate-100 pb-3">
                <div className="text-slate-600 font-medium">
                  {formattedDate}
                </div>
                <div>
                  Oleh : <span className="text-emerald-700 font-semibold">Humas Bali Bina Insani</span>
                </div>
              </div>
            </header>

            {/* Foto Utama Penuh Kolom */}
            {item.fotoUrl && (
              <div className="mb-5">
                <div className="relative w-full aspect-[16/9] md:aspect-[16/10] overflow-hidden bg-slate-100 rounded-lg border border-slate-200/80 shadow-sm">
                  <Image
                    src={item.fotoUrl}
                    alt={item.judul}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    quality={85}
                  />
                </div>
                {/* Kepsyen Jurnalistik Foto */}
                <p className="mt-2 text-xs sm:text-[13px] text-slate-500 italic leading-relaxed">
                  Dokumentasi: {item.judul}. (Foto: Humas Pondok Pesantren Bali Bina Insani)
                </p>
              </div>
            )}

            {/* Tombol Berbagi Media Sosial (Tepat di bawah foto/kepsyen sebelum isi berita) */}
            <div className="mb-6 py-3 border-y border-slate-100 flex items-center justify-between">
              <ShareButtons
                title={item.judul}
                url={`/kegiatan/${item.slug || item.id}`}
              />
            </div>

            {/* Isi Redaksi Berita */}
            <div className="prose prose-slate max-w-none text-slate-800 text-[16px] md:text-[17px] leading-[1.8] md:leading-[1.85] font-sans">
              {paragraphs.map((para, i) => (
                <Fragment key={i}>
                  <p className="mb-5 whitespace-pre-line text-justify leading-relaxed">
                    {para}
                  </p>

                  {/* Fitur "Baca Juga :" In-Article Recommendation */}
                  {i === 0 && recommendation && (
                    <div className="my-6 p-4 bg-slate-50 border-l-4 border-emerald-600 rounded-r-lg font-sans not-prose">
                      <span className="font-bold text-slate-900 text-sm md:text-base">
                        Baca Juga :{" "}
                      </span>
                      <Link
                        href={`/kegiatan/${recommendation.slug || recommendation.id}`}
                        className="font-bold text-emerald-800 hover:text-emerald-900 transition-colors text-sm md:text-base hover:underline"
                      >
                        {recommendation.judul}
                      </Link>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>

          </article>

          {/* ═══════════ SIDEBAR KABAR TERBARU (4 Kolom - Tanpa Banner Aksi Atas) ═══════════ */}
          <aside className="lg:col-span-4 w-full">
            <div className="sticky top-24 space-y-8">
              
              {/* Widget Kabar Terbaru */}
              <div>
                <div className="border-b-2 border-emerald-600 pb-2 mb-4 flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900">
                    Kabar Terbaru
                  </h2>
                  <Link
                    href="/kegiatan"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    Lihat Semua →
                  </Link>
                </div>

                {latestArticles.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {latestArticles.map((k) => (
                      <Link
                        key={k.id}
                        href={`/kegiatan/${k.slug || k.id}`}
                        className="group flex items-start justify-between gap-3.5 py-3.5 first:pt-1 last:pb-0 hover:bg-slate-50/70 rounded-lg transition-colors p-1.5 -mx-1.5"
                      >
                        {/* Sisi Kiri: Judul & Tanggal */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-[13.5px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-3 leading-snug mb-1.5 font-sans">
                            {k.judul}
                          </h3>
                          <span className="text-[11px] text-slate-400 block font-sans">
                            {formatIndonesianDate(k.tanggal)}
                          </span>
                        </div>

                        {/* Sisi Kanan: Foto Thumbnail */}
                        <div className="relative w-20 h-16 sm:w-24 sm:h-18 shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-200/80">
                          {k.fotoUrl ? (
                            <Image
                              src={k.fotoUrl}
                              alt={k.judul}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="96px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                              <Images className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Tidak ada berita lainnya saat ini.
                  </p>
                )}
              </div>

              {/* Widget Profil & Kontak Humas */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/70 text-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
                  Pondok Pesantren Bali Bina Insani
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Pusat informasi resmi kegiatan belajar, kepesantrenan, dan prestasi santri di Tabanan, Bali.
                </p>
                <Link
                  href="/kontak"
                  className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Kontak Sekretariat & Humas →
                </Link>
              </div>

            </div>
          </aside>

        </div>

        {/* ── 3. Bagian Berita Terkait (3 Kartu Responsif di Bawah) ── */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 sm:mt-18 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 flex items-center gap-2.5">
                  <span className="w-2.5 h-6 bg-emerald-600 rounded-full inline-block" />
                  Berita Terkait
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Kabar dan agenda kegiatan lainnya seputar Pondok Pesantren Bali Bina Insani
                </p>
              </div>
              <Link
                href="/kegiatan"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                Semua Berita <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/kegiatan/${rel.slug || rel.id}`}
                  className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col h-full"
                >
                  {/* Thumbnail Card */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    {rel.fotoUrl ? (
                      <Image
                        src={rel.fotoUrl}
                        alt={rel.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <Images className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm border border-slate-100">
                      {getCategory(rel.judul)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-400 mb-2">
                        <span>{formatIndonesianDate(rel.tanggal)}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                        {rel.judul}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {rel.deskripsi}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

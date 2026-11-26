import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Coins,
  GraduationCap,
  MessageCircle,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGaleriList, getSiteSettings } from "@/lib/data-fetching";
import { getLembagaBySlug, LEMBAGA_LIST, type LembagaSlug } from "@/lib/lembaga-data";
import { PaudLandingView } from "@/components/public/PaudLandingView";

export function generateStaticParams() {
  return LEMBAGA_LIST.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lembaga = getLembagaBySlug(slug);
  if (!lembaga) {
    return { title: "Lembaga Tidak Ditemukan" };
  }

  const title = `${lembaga.title} (${lembaga.code}) | Pondok Pesantren Bali Bina Insani`;
  const description = `${lembaga.defaultDeskripsi} Informasi program unggulan, prestasi, dan biaya pendaftaran santri baru jenjang ${lembaga.code}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/lembaga/${lembaga.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.pesantrenbali.my.id/lembaga/${lembaga.slug}`,
      type: "website",
    },
  };
}

function getLogoFromSettings(
  slug: LembagaSlug,
  settings: Awaited<ReturnType<typeof getSiteSettings>>
) {
  if (!settings) return null;
  const map: Record<LembagaSlug, string | null | undefined> = {
    paud: settings.paudLogoUrl,
    mi: settings.miLogoUrl,
    mts: settings.mtsLogoUrl,
    ma: settings.maLogoUrl,
  };
  return map[slug] || null;
}

function getDeskripsiFromSettings(
  slug: LembagaSlug,
  settings: Awaited<ReturnType<typeof getSiteSettings>>
) {
  if (!settings) return null;
  const map: Record<LembagaSlug, string | null | undefined> = {
    paud: settings.paudDeskripsi,
    mi: settings.miDeskripsi,
    mts: settings.mtsDeskripsi,
    ma: settings.maDeskripsi,
  };
  return map[slug] || null;
}

function getPoinFromSettings(
  slug: LembagaSlug,
  settings: Awaited<ReturnType<typeof getSiteSettings>>
) {
  if (!settings) return null;
  const map: Record<LembagaSlug, string | null | undefined> = {
    paud: settings.paudPoin,
    mi: settings.miPoin,
    mts: settings.mtsPoin,
    ma: settings.maPoin,
  };
  const raw = map[slug];
  if (!raw) return null;
  const parsed = raw.split("\n").map((p) => p.trim()).filter(Boolean);
  return parsed.length > 0 ? parsed : null;
}

export default async function LembagaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lembaga = getLembagaBySlug(slug);
  if (!lembaga) {
    notFound();
  }

  const settings = await getSiteSettings();
  if (lembaga.slug === "paud") {
    const galeriItems = await getGaleriList();
    return (
      <PaudLandingView
        lembaga={lembaga}
        settings={settings ?? null}
        galeriItems={galeriItems}
      />
    );
  }
  const logoUrl = getLogoFromSettings(lembaga.slug, settings);
  const deskripsi = getDeskripsiFromSettings(lembaga.slug, settings) || lembaga.defaultDeskripsi;
  const poinUtama = getPoinFromSettings(lembaga.slug, settings) || lembaga.defaultPoin;
  const waNumber = (settings?.noWa || "6281234567890").replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#1A4D2E] via-[#164227] to-[#0f331d] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/75 hover:text-amber-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {logoUrl ? (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white p-2 shadow-lg shrink-0 relative overflow-hidden">
                <Image
                  src={logoUrl}
                  alt={`Logo ${lembaga.title}`}
                  fill
                  className="object-contain p-1.5"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shrink-0 backdrop-blur-sm">
                <span className="text-2xl font-black text-amber-300 leading-none">{lembaga.code}</span>
                <span className="text-[10px] text-white/75 mt-1 font-medium">Bali Bina Insani</span>
              </div>
            )}

            <div className="space-y-2.5 max-w-3xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3 py-1 rounded-full">
                {lembaga.badge}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold font-heading tracking-tight">
                {lembaga.title}
              </h1>
              <p className="text-sm md:text-base text-white/85 leading-relaxed">
                {deskripsi}
              </p>
            </div>
          </div>

          {/* Highlight Poin */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {poinUtama.map((poin, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-2 rounded-xl text-xs md:text-sm text-white/95 backdrop-blur-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{poin}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-12">
        {/* Program-Program Pendidikan */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#1A4D2E]/10 text-[#1A4D2E] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Program Pendidikan &amp; Unggulan</h2>
              <p className="text-xs md:text-sm text-gray-500">Kurikulum dan pembinaan khusus jenjang {lembaga.code}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {lembaga.programUnggulan.map((prog, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1A4D2E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base">{prog.title}</h3>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{prog.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prestasi */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Prestasi &amp; Capaian</h2>
              <p className="text-xs md:text-sm text-gray-500">Rekam jejak prestasi santri jenjang {lembaga.code}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {lembaga.prestasi.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full">
                    <Award className="w-3.5 h-3.5" /> {item.kategori}
                  </span>
                  <h3 className="font-semibold text-gray-800 text-base mt-3 leading-snug">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.keterangan}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Informasi Biaya Pendaftaran Santri Baru */}
        <section className="grid lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header orange-to-green accent matching brochure */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-extrabold tracking-wide uppercase">
                  Biaya Pendaftaran Santri Baru
                </h2>
                <p className="text-xs text-white/90">Jenjang {lembaga.title}</p>
              </div>
            </div>

            {/* Table matching the reference image */}
            <div className="bg-[#0B5D46] text-white">
              <div className="grid grid-cols-12 border-b border-white/25 bg-[#084937]">
                <div className="col-span-6 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white/80">
                  Komponen Biaya
                </div>
                <div className="col-span-6 px-5 py-3.5 text-sm md:text-base font-extrabold uppercase tracking-wide text-amber-300 border-l border-white/25">
                  {lembaga.biaya.headerLabel}
                </div>
              </div>

              {lembaga.biaya.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 border-b border-white/20 last:border-none"
                >
                  <div className="col-span-6 px-5 py-3.5">
                    <p className="font-semibold text-sm md:text-base">{item.label}</p>
                    {item.includes && item.includes.length > 0 && (
                      <div className="mt-2 space-y-1.5 pl-1">
                        <p className="text-xs text-white/75 italic">include:</p>
                        {item.includes.map((inc, i) => (
                          <p key={i} className="text-sm text-white/95">
                            {inc}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-span-6 px-5 py-3.5 border-l border-white/25">
                    <p className="font-bold text-sm md:text-base text-white">{item.nominal}</p>
                    {item.includes && item.includes.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        <p className="text-xs opacity-0 select-none">include</p>
                        {item.includes.map((_, i) => (
                          <p key={i} className="text-sm flex items-center text-amber-300 font-bold">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {lembaga.biaya.catatan && (
              <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 text-xs text-amber-800 font-medium">
                * {lembaga.biaya.catatan}
              </div>
            )}
          </div>

          {/* CTA Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-7 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#1A4D2E]/10 text-[#1A4D2E] flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Siap Mendaftar di {lembaga.code}?
              </h3>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                Lengkapi formulir pendaftaran santri baru secara online atau hubungi panitia PSB jika membutuhkan informasi lebih lanjut.
              </p>
            </div>

            {settings?.infoRekening && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-500 uppercase tracking-wider">Rekening Pembayaran</p>
                <p className="font-semibold text-slate-800 text-sm">{settings.infoRekening}</p>
              </div>
            )}

            <div className="space-y-3 pt-1">
              <Link href={`/pendaftaran?jenjang=${lembaga.code}`} className="block">
                <Button className="w-full h-12 rounded-xl bg-[#1A4D2E] hover:bg-[#133b22] text-white font-bold text-sm gap-2 shadow-sm">
                  Daftar {lembaga.code} Sekarang <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                  `Assalamu'alaikum Admin PSB Bali Bina Insani, saya ingin bertanya informasi pendaftaran jenjang ${lembaga.title} (${lembaga.code}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-sm gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Tanya Panitia via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Jenjang Lainnya */}
        <section className="pt-4 border-t border-gray-200/70">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
            Lihat Jenjang Pendidikan Lainnya
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LEMBAGA_LIST.map((item) => {
              const isCurrent = item.slug === lembaga.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/lembaga/${item.slug}`}
                  className={`p-4 rounded-xl border transition-all ${isCurrent
                    ? "bg-[#1A4D2E] text-white border-[#1A4D2E] shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#1A4D2E]/50 hover:bg-[#1A4D2E]/5"
                    }`}
                >
                  <p className={`text-xs font-bold ${isCurrent ? "text-amber-300" : "text-[#1A4D2E]"}`}>
                    {item.code}
                  </p>
                  <p className="text-sm font-semibold mt-0.5 truncate">{item.title}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}


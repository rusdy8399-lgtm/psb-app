import { getSiteSettings } from "@/lib/data-fetching";
import { PPDBForm } from "@/components/public/PPDBForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Santri Baru (PSB) | Pondok Pesantren Bali Bina Insani",
  description: "Formulir pendaftaran santri baru (PSB) Pondok Pesantren Bali Bina Insani jenjang PAUD, MI, MTs, dan MA. Daftarkan putra-putri Anda secara online dengan mudah dan cepat.",
  alternates: {
    canonical: "/pendaftaran",
  },
  openGraph: {
    title: "Pendaftaran Santri Baru (PSB) | Pondok Pesantren Bali Bina Insani",
    description: "Formulir pendaftaran santri baru (PSB) Pondok Pesantren Bali Bina Insani jenjang PAUD, MI, MTs, dan MA. Daftarkan putra-putri Anda secara online dengan mudah dan cepat.",
    url: "https://www.pesantrenbali.my.id/pendaftaran",
    type: "website",
  },
};

export default async function PPDBPage({
  searchParams,
}: {
  searchParams: Promise<{ jenjang?: string }>;
}) {
  const [settings, resolvedParams] = await Promise.all([
    getSiteSettings(),
    searchParams,
  ]);

  const validJenjang = ["PAUD", "MI", "MTs", "MA"];
  const initialJenjang =
    resolvedParams.jenjang && validJenjang.includes(resolvedParams.jenjang)
      ? resolvedParams.jenjang
      : "";

  return (
    <div className="bg-background min-h-screen pt-8 pb-32">
      <PPDBForm settings={settings || null} initialJenjang={initialJenjang} />
    </div>
  );
}

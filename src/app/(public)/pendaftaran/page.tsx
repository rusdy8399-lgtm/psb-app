import { getSiteSettings } from "@/lib/data-fetching";
import { PPDBForm } from "@/components/public/PPDBForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Santri Baru (PSB) | Pondok Pesantren Bali Bina Insani",
  description: "Formulir pendaftaran santri baru (PSB) Pondok Pesantren Bali Bina Insani jenjang MTs dan MA. Daftarkan putra-putri Anda secara online dengan mudah dan cepat.",
  alternates: {
    canonical: "/pendaftaran",
  },
  openGraph: {
    title: "Pendaftaran Santri Baru (PSB) | Pondok Pesantren Bali Bina Insani",
    description: "Formulir pendaftaran santri baru (PSB) Pondok Pesantren Bali Bina Insani jenjang MTs dan MA. Daftarkan putra-putri Anda secara online dengan mudah dan cepat.",
    url: "https://www.pesantrenbali.my.id/pendaftaran",
    type: "website",
  },
};

export default async function PPDBPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-background min-h-screen pt-8 pb-32">
      <PPDBForm settings={settings || null} />
    </div>
  );
}

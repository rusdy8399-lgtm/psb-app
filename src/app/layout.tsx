import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PSB Online - Pondok Pesantren Bali Bina Insani",
  description: "Penerimaan Santri Baru (PSB) Pondok Pesantren Bali Bina Insani Tolerance Islamic Boarding School. Daftar online untuk jenjang MTs dan MA di Tabanan, Bali.",
  metadataBase: new URL("https://project-98lnv.vercel.app"),
  openGraph: {
    title: "PSB Online - Pondok Pesantren Bali Bina Insani",
    description: "Penerimaan Santri Baru (PSB) Pondok Pesantren Bali Bina Insani. Daftar secara online untuk jenjang MTs dan MA.",
    url: "https://project-98lnv.vercel.app",
    siteName: "PSB Bali Bina Insani",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PSB Online - Pondok Pesantren Bali Bina Insani",
    description: "Penerimaan Santri Baru (PSB) Pondok Pesantren Bali Bina Insani.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

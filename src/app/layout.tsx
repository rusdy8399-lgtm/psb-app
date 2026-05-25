import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/public/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport = {
  themeColor: "#1A4D2E",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Pesantren Bali | Pondok Pesantren Bali Bina Insani | Pesantren Terbaik",
    template: "%s | Pesantren Bali"
  },
  description: "Pesantren Bali Bina Insani (Est. 1991) - Pondok Pesantren terbaik di Bali. Pendidikan Islam terpadu, Tahfidz Al-Qur'an, dan karakter islami bagi santri se-Bali.",
  keywords: ["pesantren bali", "pesantren di bali", "pondok pesantren bali", "sekolah islam bali", "pesantren terbaik bali", "bali bina insani"],
  metadataBase: new URL("https://project-98lnv.vercel.app"),
  openGraph: {
    title: "Pesantren Bali | Pondok Pesantren Bali Bina Insani",
    description: "Pesantren terbaik di Bali dengan kurikulum terpadu dan program unggulan Tahfidz Al-Qur'an.",
    siteName: "Pesantren Bali Bina Insani",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pesantren Bali Bina Insani | Sekolah Islam Terbaik di Bali",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
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
      <head>
        <JsonLd />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.dicebear.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Berhasil | Pondok Pesantren Bali Bina Insani",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PPDBSuksesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { getSettings } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings (Cached per request)
  const settings = await getSettings();
  const waNumber = settings?.noWa?.replace(/\D/g, '') || "6281234567890";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1 shrink-0">{children}</main>
      <Footer settings={settings} />

      {/* Floating WA Button - Dynamic */}
      <Link
        href={`https://wa.me/${waNumber}`}
        target="_blank"
        className="fixed bottom-[80px] right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 md:px-5 h-[44px] md:h-auto py-0 md:py-3 rounded-[1rem] shadow-md transition-all hover:-translate-y-1"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="font-medium text-[13px] md:text-sm">Hubungi Admin</span>
      </Link>
    </div>
  );
}

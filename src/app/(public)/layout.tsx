import { getSettings } from "@/lib/db";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingWA } from "@/components/public/FloatingWA";

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
      <FloatingWA waNumber={waNumber} />
    </div>
  );
}

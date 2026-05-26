"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FloatingWA({ waNumber }: { waNumber: string }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const idle = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 1));
      idle(() => {
        import("@/styles/animations.css");
      });
    }
  }, []);

  if (!mounted) {
    return null;
  }

  // Hide on registration page
  if (pathname === "/pendaftaran" || pathname?.startsWith("/ppdb/")) {
    return null;
  }

  return (
    <Link
      href={`https://wa.me/${waNumber}`}
      target="_blank"
      aria-label="Hubungi kami melalui WhatsApp"
      className="fixed bottom-[80px] right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 md:px-5 h-[48px] md:h-auto py-0 md:py-3 rounded-[1rem] shadow-md transition-all hover:-translate-y-1 cursor-pointer will-change-transform"
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      <span className="font-medium text-[13px] md:text-sm">Hubungi Admin</span>
    </Link>
  );
}

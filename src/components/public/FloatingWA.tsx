"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function FloatingWA({ waNumber }: { waNumber: string }) {
  const pathname = usePathname();

  // Hide on registration page
  if (pathname === "/ppdb" || pathname?.startsWith("/ppdb/")) {
    return null;
  }

  return (
    <Link
      href={`https://wa.me/${waNumber}`}
      target="_blank"
      className="fixed bottom-[80px] right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 md:px-5 h-[44px] md:h-auto py-0 md:py-3 rounded-[1rem] shadow-md transition-all hover:-translate-y-1"
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      <span className="font-medium text-[13px] md:text-sm">Hubungi Admin</span>
    </Link>
  );
}

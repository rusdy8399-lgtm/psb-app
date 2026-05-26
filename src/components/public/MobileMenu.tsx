"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  navLinks: { name: string; href: string }[];
  pathname: string | null;
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileMenu({ navLinks, pathname, setIsOpen }: MobileMenuProps) {
  return (
    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 font-heading">
      <div className="container mx-auto px-6 py-6 flex flex-col space-y-5">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={`text-base md:text-lg font-medium tracking-normal transition-colors flex items-center justify-between ${
              pathname === link.href 
                ? "text-[#1A4D2E] border-l-4 border-gold pl-4" 
                : "text-gray-600 hover:text-[#1A4D2E] pl-4 border-l-4 border-transparent"
            }`}
          >
            {link.name}
            {pathname === link.href && <div className="w-2 h-2 bg-gold rounded-full" />}
          </Link>
        ))}
        <div className="pt-6 border-t border-slate-100 italic">
           <Link href="/pendaftaran" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-[#1A4D2E] hover:bg-[#133d24] text-white text-sm md:text-base font-medium px-5 py-3 h-auto rounded-xl shadow-md transition-all">
                Daftar Sekarang
              </Button>
           </Link>
        </div>
      </div>
    </div>
  );
}

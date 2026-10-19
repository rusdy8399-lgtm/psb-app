"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { NavItem } from "./Navbar";

interface MobileMenuProps {
  navLinks: NavItem[];
  pathname: string | null;
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileMenu({ navLinks, pathname, setIsOpen }: MobileMenuProps) {
  return (
    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 font-heading">
      <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
        {navLinks.map((link) => {
          if (link.children) {
            return (
              <div key={link.name} className="flex flex-col space-y-2 pt-1 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-4">
                  {link.name}
                </span>
                <div className="pl-4 space-y-2 border-l-2 border-emerald-100 ml-4">
                  {link.children.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-sm md:text-base font-semibold tracking-normal transition-colors flex items-center justify-between py-1.5 ${
                          isSubActive
                            ? "text-[#1A4D2E] font-bold"
                            : "text-slate-600 hover:text-[#1A4D2E]"
                        }`}
                      >
                        <span>{sub.name}</span>
                        {isSubActive && (
                          <div className="w-2 h-2 bg-[#1A4D2E] rounded-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-base md:text-lg font-medium tracking-normal transition-colors flex items-center justify-between py-1 ${
                isActive
                  ? "text-[#1A4D2E] border-l-4 border-gold pl-4"
                  : "text-gray-600 hover:text-[#1A4D2E] pl-4 border-l-4 border-transparent"
              }`}
            >
              <span>{link.name}</span>
              {isActive && <div className="w-2 h-2 bg-gold rounded-full" />}
            </Link>
          );
        })}

        <div className="pt-6 border-t border-slate-100">
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

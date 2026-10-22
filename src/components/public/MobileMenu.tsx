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
    <div className="lg:hidden absolute top-full left-0 w-full bg-[#1A4D2E] border-t border-amber-400/30 border-b border-[#143D24] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 font-heading z-50 relative overflow-hidden">

      <div className="container mx-auto px-6 py-6 flex flex-col space-y-3 relative z-10">
        {navLinks.map((link) => {
          if (link.children) {
            return (
              <div key={link.name} className="flex flex-col space-y-1.5 pt-1 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300/80 pl-4">
                  {link.name}
                </span>
                <div className="pl-4 space-y-1.5 border-l-2 border-amber-400/30 ml-4">
                  {link.children.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-sm md:text-base font-semibold tracking-normal transition-all flex items-center justify-between px-3 py-2 rounded-xl ${
                          isSubActive
                            ? "text-amber-300 font-bold bg-white/10"
                            : "text-white/80 hover:text-amber-300 hover:bg-white/5"
                        }`}
                      >
                        <span>{sub.name}</span>
                        {isSubActive && (
                          <div className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
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
              className={`text-base md:text-lg font-medium tracking-normal transition-all flex items-center justify-between px-4 py-2.5 rounded-xl ${
                isActive
                  ? "text-amber-300 font-bold bg-white/10 border-l-4 border-amber-400"
                  : "text-white/90 hover:text-amber-300 hover:bg-white/5 border-l-4 border-transparent"
              }`}
            >
              <span>{link.name}</span>
              {isActive && (
                <div className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
              )}
            </Link>
          );
        })}

        {/* Bottom CTA Button */}
        <div className="pt-4 border-t border-white/10">
          <Link href="/pendaftaran" onClick={() => setIsOpen(false)}>
            <Button className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-green-950 font-bold text-sm md:text-base px-5 py-3.5 h-auto rounded-xl shadow-lg shadow-black/25 transition-all uppercase tracking-wider border border-amber-200/50">
              Daftar PSB Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

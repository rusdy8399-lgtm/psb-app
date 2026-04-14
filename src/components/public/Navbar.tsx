"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tentang Kami", href: "/#tentang" },
  { name: "Kegiatan", href: "/kegiatan" },
  { name: "Fasilitas", href: "/fasilitas" },
  { name: "Kontak", href: "/kontak" },
];

interface NavbarProps {
  settings?: {
    namaWeb: string;
    logoUrl?: string | null;
  } | null;
}

export function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const schoolName = settings?.namaWeb || "Bali Bina Insani";

  return (
    <header 
      className={`w-full sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-1 md:py-1.5" 
          : "bg-white py-2 md:py-2.5 border-b border-slate-50"
      }`}
    >
      {/* Main Navbar - Premium Left-Aligned Layout */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Left Section: Single Unified Logo */}
        <Link href="/" className="flex items-center group transition-all relative h-[32px] md:h-[68px] w-[140px] md:w-[240px]">
          <Image 
            src="/logo-navbar.jpg" 
            alt="Bali Bina Insani Tolerance Islamic Boarding School" 
            fill
            priority
            className="object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 140px, 240px"
          />
        </Link>

        {/* Right Section: Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 md:gap-8">
          <nav>
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-base font-medium tracking-normal transition-all hover:text-green-700 relative py-1 group/link font-sans ${
                      pathname === link.href ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    {link.name}
                    {/* Gold indicator for active/hover state */}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 rounded-full ${
                      pathname === link.href ? "w-full" : "w-0 group-hover/link:w-full"
                    }`} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Button */}
          <Link href="/ppdb">
            <Button className="bg-[#1A4D2E] hover:bg-[#133d24] text-white font-sans font-medium px-5 py-2.5 h-auto rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm border border-gold/20">
              Pendaftaran
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-1.5 text-slate-800 focus:outline-none transition-colors rounded-xl hover:bg-slate-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 font-heading">
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base md:text-lg font-medium tracking-normal transition-colors flex items-center justify-between ${
                  pathname === link.href ? "text-green-700 border-l-4 border-gold pl-4" : "text-gray-600 hover:text-green-700 pl-4 border-l-4 border-transparent"
                }`}
              >
                {link.name}
                {pathname === link.href && <div className="w-2 h-2 bg-gold rounded-full" />}
              </Link>
            ))}
            <div className="pt-6 border-t border-slate-100 italic">
               <Link href="/ppdb" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[#1A4D2E] hover:bg-[#133d24] text-white text-sm md:text-base font-medium px-5 py-3 h-auto rounded-xl shadow-md transition-all">
                    Daftar Sekarang
                  </Button>
               </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MobileMenu = dynamic(
  () => import("./MobileMenu").then((mod) => mod.MobileMenu),
  { ssr: false }
);

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const schoolName = settings?.namaWeb || "Bali Bina Insani";

  const isFormPage = pathname?.startsWith("/pendaftaran");

  return (
    <header 
      className={`w-full sticky top-0 z-50 transition-all duration-500 ${
        isFormPage 
          ? "bg-white h-[60px] flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-b border-slate-100 py-0"
          : isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-sm py-1 md:py-1.5" 
            : "bg-white py-2 md:py-2.5 border-b border-slate-50"
      }`}
    >
      {/* Main Navbar - Premium Left-Aligned Layout */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Left Section: Single Unified Logo */}
        <Link href="/" className={`flex items-center group transition-all relative ${
          isFormPage ? "h-[36px] w-[36px] overflow-hidden rounded-full" : "h-[32px] md:h-[68px] w-[140px] md:w-[240px]"
        }`}>
          <Image 
            src="/logo-navbar.jpg" 
            alt="Bali Bina Insani Tolerance Islamic Boarding School" 
            fill
            loading="eager"
            quality={85}
            className={`${isFormPage ? "object-cover" : "object-contain"} object-left transition-transform duration-300 group-hover:scale-[1.02]`}
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
                    className={`text-base font-medium tracking-normal transition-all hover:text-[#1A4D2E] relative py-1 group/link font-sans ${
                      pathname === link.href ? "text-[#1A4D2E]" : "text-gray-600"
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
          <Link href="/pendaftaran">
            <Button className="bg-[#1A4D2E] hover:bg-[#133d24] text-white font-sans font-medium px-5 py-2.5 h-auto rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm border border-gold/20">
              Pendaftaran
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        {!isFormPage && (
          <button
            className="md:hidden p-3 min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-800 focus:outline-none transition-colors rounded-xl hover:bg-slate-50 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        )}
      </div>

      {/* Mobile Navigation Panel - Dynamic */}
      {isOpen && (
        <MobileMenu navLinks={navLinks} pathname={pathname} setIsOpen={setIsOpen} />
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MobileMenu = dynamic(
  () => import("./MobileMenu").then((mod) => mod.MobileMenu),
  { ssr: false }
);

export interface NavItem {
  name: string;
  href: string;
  children?: { name: string; href: string; description?: string }[];
}

export const navLinks: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Tentang Kami", href: "/#tentang" },
  {
    name: "Kegiatan",
    href: "/kegiatan",
    children: [
      {
        name: "Kabar Pesantren",
        href: "/kegiatan",
        description: "Berita, agenda, dan prestasi santri",
      },
      {
        name: "Galeri Foto",
        href: "/galeri",
        description: "Dokumentasi visual momen berharga",
      },
    ],
  },
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

  // Minimal clean header on student registration form
  if (isFormPage) {
    return (
      <header className="w-full sticky top-0 z-50 bg-white h-[60px] flex items-center shadow-sm border-b border-slate-100">
        <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-[38px] w-[150px]">
              <Image
                src={settings?.logoUrl || "/logo-navbar.jpg"}
                alt={schoolName}
                fill
                loading="eager"
                quality={85}
                className="object-contain object-left"
              />
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-600 hover:text-[#1A4D2E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full sticky top-0 z-50 shadow-md transition-all duration-300">
      {/* Top Accent Strip (Gold) */}
      <div className="h-[3px] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 w-full" />

      {/* Main Bar: Institutional Green */}
      <div
        className={`w-full bg-[#1A4D2E] transition-all duration-300 relative ${
          isScrolled ? "h-[68px] md:h-[72px]" : "h-[74px] md:h-[80px]"
        }`}
      >

        {/* Layer 1: Left Organic White Wave Pod (Holds Logo) */}
        <div className="absolute inset-y-0 left-0 z-10 flex items-center">
          {/* Solid White Base Container */}
          <div className="bg-white h-full flex items-center pl-4 sm:pl-6 md:pl-10 lg:pl-12 pr-4 sm:pr-6 md:pr-8 shadow-[4px_0_15px_rgba(0,0,0,0.06)]">
            <Link
              href="/"
              className={`relative block transition-all group ${
                isScrolled
                  ? "h-[38px] sm:h-[44px] md:h-[50px] w-[130px] sm:w-[170px] md:w-[220px]"
                  : "h-[42px] sm:h-[48px] md:h-[56px] w-[140px] sm:w-[190px] md:w-[240px]"
              }`}
            >
              <Image
                src={settings?.logoUrl || "/logo-navbar.jpg"}
                alt={schoolName}
                fill
                loading="eager"
                quality={90}
                className="object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 190px, 240px"
              />
            </Link>
          </div>

          {/* SVG Wave Extension: Curves smoothly from white into green */}
          <div className="relative h-full w-[36px] sm:w-[46px] md:w-[64px] pointer-events-none -ml-[1px]">
            <svg
              viewBox="0 0 64 80"
              preserveAspectRatio="none"
              className="w-full h-full text-white fill-current drop-shadow-[2px_0_4px_rgba(0,0,0,0.03)]"
            >
              {/* S-curve wave: flows from top-left (0,0) down-right to (64,80) */}
              <path d="M0,0 C32,0 36,46 64,80 L0,80 Z" />
            </svg>
          </div>
        </div>

        {/* Layer 2: Navbar Content (Menu & Actions on Green Canvas) */}
        <div className="max-w-[1440px] mx-auto h-full px-4 md:px-8 flex items-center justify-end relative z-20">
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <ul className="flex items-center gap-7">
              {navLinks.map((link) => {
                const isSubActive =
                  link.children &&
                  link.children.some((sub) => pathname === sub.href);
                const isActive = pathname === link.href || isSubActive;

                return (
                  <li key={link.name} className="relative">
                    {link.children ? (
                      <div className="relative group/dropdown py-2">
                        <button
                          type="button"
                          className={`flex items-center gap-1.5 text-[15px] font-medium tracking-normal transition-all font-sans cursor-pointer ${
                            isActive
                              ? "text-amber-300 font-bold"
                              : "text-white/90 hover:text-amber-300"
                          }`}
                        >
                          <span>{link.name}</span>
                          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover/dropdown:rotate-180 text-white/70 group-hover/dropdown:text-amber-300" />
                          {/* Active gold underline indicator */}
                          {isActive && (
                            <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                          )}
                        </button>

                        {/* Floating Dropdown Card */}
                        <div className="absolute top-full left-0 pt-2 hidden group-hover/dropdown:block z-50">
                          <div className="w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {link.children.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={`block px-3.5 py-2.5 rounded-xl transition-all hover:bg-emerald-50/70 group/item ${
                                  pathname === sub.href
                                    ? "bg-emerald-50 text-[#1A4D2E]"
                                    : "text-slate-700"
                                }`}
                              >
                                <span className="text-sm font-bold text-slate-800 group-hover/item:text-[#1A4D2E] transition-colors block leading-snug">
                                  {sub.name}
                                </span>
                                {sub.description && (
                                  <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">
                                    {sub.description}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-[15px] font-medium tracking-normal transition-all relative py-2 font-sans inline-block ${
                          isActive
                            ? "text-amber-300 font-bold"
                            : "text-white/90 hover:text-amber-300"
                        }`}
                      >
                        {link.name}
                        {/* Active gold underline indicator */}
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* CTA Button: Gold PSB Button */}
            <Link href="/pendaftaran" className="ml-2">
              <Button className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-green-950 font-bold px-5 py-2.5 h-auto rounded-full shadow-md hover:shadow-amber-400/25 transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-wider font-sans border border-amber-200/40 cursor-pointer">
                Daftar PSB
              </Button>
            </Link>
          </nav>

          {/* Medium screen CTA + Mobile toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/pendaftaran" className="hidden sm:inline-block">
              <Button className="bg-amber-400 hover:bg-amber-300 text-green-950 font-bold px-4 py-2 h-auto rounded-full text-xs uppercase tracking-wider">
                Daftar PSB
              </Button>
            </Link>
            <button
              className="p-2.5 text-white hover:text-amber-300 focus:outline-none transition-colors rounded-xl cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <MobileMenu
          navLinks={navLinks}
          pathname={pathname}
          setIsOpen={setIsOpen}
        />
      )}
    </header>
  );
}

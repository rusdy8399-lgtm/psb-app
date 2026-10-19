"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
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

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-500 ${isFormPage
          ? "bg-white h-[60px] flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-b border-slate-100 py-0"
          : isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-1 md:py-1.5"
            : "bg-white py-2 md:py-2.5 border-b border-slate-50"
        }`}
    >
      {/* Main Navbar */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* Left Section: Single Unified Logo */}
        <Link
          href="/"
          className={`flex items-center group transition-all relative ${isFormPage
              ? "h-[36px] w-[36px] overflow-hidden rounded-full"
              : "h-[32px] md:h-[68px] w-[140px] md:w-[240px]"
            }`}
        >
          <Image
            src={settings?.logoUrl || "/logo-navbar.jpg"}
            alt={schoolName}
            fill
            loading="eager"
            quality={85}
            className={`${isFormPage ? "object-cover" : "object-contain"
              } object-left transition-transform duration-300 group-hover:scale-[1.02]`}
            sizes="(max-width: 768px) 140px, 240px"
          />
        </Link>

        {/* Right Section: Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 md:gap-8">
          <nav>
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isSubActive =
                  link.children &&
                  link.children.some((sub) => pathname === sub.href);
                const isActive = pathname === link.href || isSubActive;

                return (
                  <li key={link.name} className="relative">
                    {link.children ? (
                      <div className="relative group/dropdown py-1">
                        <button
                          type="button"
                          className={`flex items-center gap-1.5 text-base font-medium tracking-normal transition-all hover:text-[#1A4D2E] relative group/link font-sans cursor-pointer ${isActive ? "text-[#1A4D2E]" : "text-gray-600"
                            }`}
                        >
                          <span>{link.name}</span>
                          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover/dropdown:rotate-180 text-gray-400 group-hover/dropdown:text-[#1A4D2E]" />
                          {/* Gold indicator */}
                          <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 rounded-full ${isActive ? "w-full" : "w-0 group-hover/link:w-full"
                              }`}
                          />
                        </button>

                        {/* Floating Dropdown Card */}
                        <div className="absolute top-full left-0 pt-2 hidden group-hover/dropdown:block z-50">
                          <div className="w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {link.children.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={`block px-3.5 py-2.5 rounded-xl transition-all hover:bg-emerald-50/70 group/item ${pathname === sub.href
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
                        className={`text-base font-medium tracking-normal transition-all hover:text-[#1A4D2E] relative py-1 group/link font-sans ${isActive ? "text-[#1A4D2E]" : "text-gray-600"
                          }`}
                      >
                        {link.name}
                        {/* Gold indicator */}
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 rounded-full ${isActive ? "w-full" : "w-0 group-hover/link:w-full"
                            }`}
                        />
                      </Link>
                    )}
                  </li>
                );
              })}
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

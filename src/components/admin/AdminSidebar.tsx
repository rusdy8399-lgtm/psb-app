"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Building2, 
  Settings, 
  Image as ImageIcon,
  LogOut,
  Loader2,
  Images,
  Globe,
  X
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close sidebar on navigation (mobile)
  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Gagal logout:", error);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pendaftar", href: "/dashboard/pendaftar", icon: Users },
    { name: "Slider Beranda", href: "/dashboard/slider", icon: ImageIcon },
    { name: "Kegiatan", href: "/dashboard/kegiatan", icon: CalendarDays },
    { name: "Galeri Foto", href: "/dashboard/galeri", icon: Images },
    { name: "Fasilitas", href: "/dashboard/fasilitas", icon: Building2 },
    { name: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={`
        w-64 bg-primary h-screen text-white/70 flex flex-col fixed left-0 top-0 border-r border-white/10 z-50 transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Sidebar Header with Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-1 border border-white/20">
                <Image 
                  src="/logo-navbar.jpg" 
                  alt="School Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight leading-tight">C-Panel Admin</h2>
                <p className="text-[10px] text-white/50 font-bold tracking-widest uppercase">Bina Insani</p>
              </div>
            </Link>
            
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="md:hidden p-1 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Action: View Site */}
        <div className="px-4 pt-4">
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-all text-xs font-medium border border-white/10 group"
          >
            <Globe className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
            Lihat Website Publik
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-white/10 text-white font-semibold shadow-inner" 
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-gold" : "text-white/40 group-hover:text-white/70"}`} />
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(201,168,76,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 px-4 py-3 text-white/50 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 disabled:opacity-50 group font-medium"
          >
            {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5 text-white/30 group-hover:text-red-400" />}
            <span className="text-sm">{isLoggingOut ? "Keluar..." : "Log Out"}</span>
          </button>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Building2, 
  Settings, 
  Image as ImageIcon,
  LogOut,
  Loader2,
  Images
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <div className="w-64 bg-[#0a2e1c] min-h-screen text-slate-400 flex flex-col fixed left-0 top-0 border-r border-white/5">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
            B
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">C-Panel</h2>
        </div>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase ml-11">Bina Insani</p>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-white/10 text-white font-semibold" 
                  : "hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary-light" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span className="text-sm">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light shadow-[0_0_8px_var(--primary-light)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 disabled:opacity-50 group"
        >
          {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400" />}
          <span className="text-sm font-medium">{isLoggingOut ? "Keluar..." : "Log Out"}</span>
        </button>
      </div>
    </div>
  );
}

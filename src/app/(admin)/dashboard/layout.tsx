"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAFAF8] font-sans overflow-x-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center px-4 md:px-10 justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-2">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-800 tracking-tight text-sm md:text-base">Dashboard Central</h1>
              <span className="hidden xs:inline-block text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">v1.2</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-700">Administrator</span>
              <span className="text-[10px] text-slate-400 font-medium">Bina Insani • Superuser</span>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs md:text-sm border border-primary/20 shadow-sm transition-transform hover:scale-105 cursor-default">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

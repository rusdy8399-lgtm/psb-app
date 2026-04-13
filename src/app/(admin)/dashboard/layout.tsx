import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAFAF8] font-sans">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center px-10 justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-800 tracking-tight">Dashboard Central</h1>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">v1.2</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-700">Administrator</span>
              <span className="text-[10px] text-slate-400 font-medium">Bina Insani • Superuser</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shadow-sm transition-transform hover:scale-105 cursor-default">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-10 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}

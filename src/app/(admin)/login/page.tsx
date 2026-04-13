"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard"
      });

      if (authError) {
        setError(authError.message || "Email atau password salah");
        toast.error(authError.message || "Gagal masuk");
      } else {
        toast.success("Login Berhasil! Mengalihkan...");
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi ke server");
      toast.error("Kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] p-6 font-sans">
      {/* Back to Home Link */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium text-sm group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Website
      </Link>

      <div className="max-w-[440px] w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="bg-[#1A4D2E] p-10 text-center text-white relative">
          <h1 className="text-2xl font-bold font-heading tracking-tight">Login Administrator</h1>
          <p className="text-white/60 mt-2 font-medium text-xs tracking-widest uppercase">Panel Kontrol Sistem</p>
        </div>

        <div className="p-8 sm:p-10 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 opacity-70" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="font-bold text-slate-700 text-sm ml-1">Email</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@email.com"
                  className="pl-12 h-12 rounded-xl border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="password" className="font-bold text-slate-700 text-sm ml-1">Password</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-slate-200 focus:border-primary transition-all bg-slate-50/50 focus:bg-white shadow-none focus:ring-2 focus:ring-primary/10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1A4D2E] hover:bg-[#143d24] h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Restricted Access • Bali Bina Insani</p>
          </div>
        </div>
      </div>
    </div>
  );
}

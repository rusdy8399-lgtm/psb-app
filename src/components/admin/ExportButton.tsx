"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/pendaftar?export=true");
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        alert("Tidak ada data untuk diekspor.");
        return;
      }

      // Build CSV
      const headers = [
        "Kode Pendaftaran",
        "Nama Lengkap",
        "Jenjang",
        "Jenis Kelamin",
        "Tempat Lahir",
        "Tanggal Lahir",
        "Asal Sekolah",
        "NISN",
        "NIK",
        "Alamat",
        "No HP",
        "Email",
        "Status",
        "Tanggal Daftar",
      ];

      const rows = data.map((p: Record<string, string>) => [
        p.kodePendaftaran ?? "",
        p.namaLengkap ?? "",
        p.jenjang ?? "",
        p.jenisKelamin ?? "",
        p.tempatLahir ?? "",
        p.tanggalLahir ?? "",
        p.asalSekolah ?? "",
        p.nisn ?? "",
        p.nik ?? "",
        `"${(p.alamat ?? "").replace(/"/g, '""')}"`,
        p.noHp ?? "",
        p.email ?? "",
        p.status ?? "",
        p.createdAt ? new Date(p.createdAt).toLocaleDateString("id-ID") : "",
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `laporan-ppdb-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengekspor data. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2 rounded-xl border-slate-200 hover:bg-slate-50 font-semibold text-xs h-11 px-6 shadow-sm text-slate-600"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      ) : (
        <Download className="w-4 h-4 text-slate-400" />
      )}
      {isExporting ? "Mengekspor..." : "Export Laporan"}
    </Button>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendaftar, ortuWakil, berkasDokumen } from "@/lib/db/schema";
import crypto from "crypto";
import { Resend } from "resend";
import { uploadToFirebase } from "@/lib/upload";

export const dynamic = "force-dynamic";


const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Helper to save files to Firebase
async function saveFile(file: any, subDir: string) {
  if (!file || typeof file === "string" || file.size === 0) return null;
  try {
    return await uploadToFirebase(file, `ppdb/${subDir}`);
  } catch (error: any) {
    throw new Error(`Gagal upload berkas ${subDir}: ${error.message}`);
  }
}

// Helper to normalize WhatsApp number to +62 format
function normalizeWhatsApp(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/\s+/g, ""); // Remove spaces
  if (cleaned.startsWith("0")) {
    return "+62" + cleaned.slice(1);
  }
  if (cleaned.startsWith("62")) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("+62")) {
    return cleaned;
  }
  // Fallback if it doesn't match standard patterns but looks like a local number without 0
  if (cleaned.startsWith("8") && cleaned.length >= 9) {
    return "+62" + cleaned;
  }
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    console.log("PPDB API: Starting request processing...");
    const formData = await req.formData();
    console.log("PPDB API: FormData extracted.");
    
    // Extract Text Data
    const data = {
      // Profile
      jenjang: formData.get("jenjang")?.toString() || "",
      namaLengkap: formData.get("namaLengkap")?.toString() || "",
      tempatLahir: formData.get("tempatLahir")?.toString() || "",
      tanggalLahir: formData.get("tanggalLahir")?.toString() || "",
      jenisKelamin: formData.get("jenisKelamin")?.toString() || "",
      alamat: formData.get("alamat")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      nik: formData.get("nik")?.toString() || "",
      nisn: formData.get("nisn")?.toString() || "",
      noKk: formData.get("noKk")?.toString() || "",
      asalSekolah: formData.get("asalSekolah")?.toString() || "",
      anakKe: parseInt(formData.get("anakKe")?.toString() || "0") || 0,
      jumlahSaudara: parseInt(formData.get("jumlahSaudara")?.toString() || "0") || 0,
      
      // Parents
      namaAyah: formData.get("namaAyah")?.toString() || "",
      pekerjaanAyah: formData.get("pekerjaanAyah")?.toString() || "",
      penghasilanAyah: formData.get("penghasilanAyah")?.toString() || "",
      namaIbu: formData.get("namaIbu")?.toString() || "",
      pekerjaanIbu: formData.get("pekerjaanIbu")?.toString() || "",
      noHpWali: normalizeWhatsApp(formData.get("noHpWali")?.toString() || ""),
      alamatOrtu: formData.get("alamat")?.toString() || "", // Using student address if not provided
      
      // Payment
      namaPengirim: formData.get("namaPengirim")?.toString() || "",
      tanggalTransfer: formData.get("tanggalTransfer")?.toString() || new Date().toISOString().split('T')[0],
      paymentAutoVerified: formData.get("paymentAutoVerified") === "true",
    };

    // Validation
    if (!data.namaLengkap || !data.jenjang || !data.nisn) {
      return NextResponse.json({ error: "Data wajib (Nama, Jenjang, NISN) tidak lengkap" }, { status: 400 });
    }

    if (!data.noHpWali) {
      return NextResponse.json({ error: "Nomor WhatsApp wajib diisi" }, { status: 400 });
    }

    // Generate IDs
    const studentId = crypto.randomUUID();
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 9000) + 1000;
    const kodePendaftaran = `REG-2026-${timestamp}-${random}`;

    console.log("PPDB API: Processing files in parallel...");
    const files = {
      kk: formData.get("fileKK") as File,
      akta: formData.get("fileAkta") as File,
      ijazah: formData.get("fileIjazah") as File,
      foto: formData.get("fileFoto") as File,
      bukti: formData.get("fileBukti") as File,
    };

    // Run all uploads in parallel
    const [urlKk, urlAkta, urlIjazah, urlFoto, urlBukti] = await Promise.all([
      saveFile(files.kk, "kk"),
      saveFile(files.akta, "akta"),
      saveFile(files.ijazah, "ijazah"),
      saveFile(files.foto, "foto"),
      saveFile(files.bukti, "payment"),
    ]);

    const urls = {
      kk: urlKk,
      akta: urlAkta,
      ijazah: urlIjazah,
      foto: urlFoto,
      bukti: urlBukti,
    };
    console.log("PPDB API: Files processed successfully.");

    // Database Inserts (Transactional)
    console.log("PPDB API: Starting transaction...");
    await db.transaction(async (tx) => {
      console.log("PPDB API: Inserting into 'pendaftar'...");
      await tx.insert(pendaftar).values({
        id: studentId,
        kodePendaftaran,
        jenjang: data.jenjang,
        namaLengkap: data.namaLengkap,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        jenisKelamin: data.jenisKelamin,
        alamat: data.alamat,
        email: data.email,
        noHp: data.noHpWali, // Sync with parent contact for easy access
        nik: data.nik,
        nisn: data.nisn,
        noKk: data.noKk,
        asalSekolah: data.asalSekolah,
        anakKe: data.anakKe,
        jumlahSaudara: data.jumlahSaudara,
        status: "Terdaftar",
        confirmedAt: new Date(),
      });

      console.log("PPDB API: Inserting into 'ortuWakil'...");
      await tx.insert(ortuWakil).values({
        id: crypto.randomUUID(),
        pendaftarId: studentId,
        namaAyah: data.namaAyah,
        pekerjaanAyah: data.pekerjaanAyah,
        penghasilanAyah: data.penghasilanAyah,
        namaIbu: data.namaIbu,
        pekerjaanIbu: data.pekerjaanIbu,
        noHpWali: data.noHpWali,
        alamatOrtu: data.alamatOrtu,
      });

      console.log("PPDB API: Inserting into 'berkasDokumen'...");
      await tx.insert(berkasDokumen).values({
        id: crypto.randomUUID(),
        pendaftarId: studentId,
        kkUrl: urls.kk || "",
        aktaKelahiranUrl: urls.akta || "",
        ijazahUrl: urls.ijazah || "",
        pasFotoUrl: urls.foto || "",
        buktiPembayaranUrl: urls.bukti || "",
        namaPengirim: data.namaPengirim,
        tanggalTransfer: data.tanggalTransfer,
      });
    });

    console.log("PPDB API: Database inserts completed successfully.");

    // Send Confirmation Email (Async, don't block response)
    if (resend && data.email) {
      const confirmationStatus = data.paymentAutoVerified 
        ? '<div style="background-color: #dcfce7; color: #166534; padding: 10px; border-radius: 6px; font-weight: bold; text-align: center; margin-bottom: 20px;">PEMBAYARAN TERVERIFIKASI OTOMATIS</div>' 
        : "";

      resend.emails.send({
        from: "PPSB Bali Bina Insani <noreply@binainsani.com>",
        to: data.email,
        subject: `Konfirmasi Pendaftaran PPDB - ${data.namaLengkap}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #1A4D2E; color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Pendaftaran Diterima</h1>
              <p style="margin: 10px 0 0; opacity: 0.8;">PPDB Pondok Pesantren Bali Bina Insani</p>
            </div>
            <div style="padding: 30px; color: #334155; line-height: 1.6;">
              ${confirmationStatus}
              <p>Yth. Orang Tua/Wali dari <strong>${data.namaLengkap}</strong>,</p>
              <p>Terima kasih telah melakukan pendaftaran online di Pondok Pesantren Bali Bina Insani. Data Anda telah kami terima dengan detail sebagai berikut:</p>
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Kode Pendaftaran:</strong> <span style="color: #1A4D2E; font-family: monospace;">${kodePendaftaran}</span></p>
                <p style="margin: 10px 0 0;"><strong>Jenjang:</strong> ${data.jenjang}</p>
                <p style="margin: 5px 0 0;"><strong>Status:</strong> ${data.paymentAutoVerified ? "Terkonfirmasi (Lunas)" : "Menunggu Konfirmasi Pembayaran"}</p>
                <p style="margin: 5px 0 0;"><strong>Tanggal Daftar:</strong> ${new Date().toLocaleDateString('id-ID')}</p>
              </div>
              <p>Silakan simpan kode pendaftaran di atas untuk keperluan verifikasi. Anda dapat mengunduh Surat Keterangan Pendaftaran melalui tautan di bawah ini:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${req.nextUrl.origin}/ppdb/sukses?code=${kodePendaftaran}" style="background-color: #C9A84C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Surat Keterangan</a>
              </div>
              <p style="color: #ef4444; font-weight: bold; font-style: italic;">PENTING: Harap membawa dokumen fisik (KK, Akta, Ijazah) saat jadwal verifikasi lapangan.</p>
              <p>Jika ada pertanyaan, silakan hubungi Panitia PPDB melalui WhatsApp di nomor resmi kami.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">Pondok Pesantren Bali Bina Insani - Tolerance Boarding School</p>
            </div>
          </div>
        `
      }).catch(err => console.error("Resend Email Error:", err));
    }

    return NextResponse.json({ 
      success: true, 
      kodePendaftaran,
      message: "Pendaftaran berhasil dikirim. Silakan tunggu verifikasi admin." 
    });

  } catch (error: any) {
    console.error("CRITICAL PPDB API Error:", error);
    
    // Return detailed error for troubleshooting
    const detailMessage = error.message || "Unknown error";
    const stack = process.env.NODE_ENV === "development" ? error.stack : undefined;
    
    return NextResponse.json({ 
      error: "Gagal memproses pendaftaran", 
      details: detailMessage,
      stack: stack
    }, { status: 500 });
  }
}

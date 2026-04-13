import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pendaftar } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

export const dynamic = "force-dynamic";


const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch Registrant Data
    const data = await db.select()
      .from(pendaftar)
      .where(eq(pendaftar.id, id))
      .get();

    if (!data) {
      return NextResponse.json({ error: "Pendaftar tidak ditemukan" }, { status: 404 });
    }

    if (!data.email) {
      return NextResponse.json({ error: "Pendaftar tidak mencantumkan email" }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ error: "Layanan email tidak terkonfigurasi (API Key Kosong)" }, { status: 500 });
    }

    // Send Email
    await resend.emails.send({
      from: "PPSB Bali Bina Insani <noreply@binainsani.com>",
      to: data.email,
      subject: `[Re-send] Surat Keterangan Pendaftaran - ${data.namaLengkap}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #1A4D2E; color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Salinan Surat Keterangan</h1>
            <p style="margin: 10px 0 0; opacity: 0.8;">PPDB Pondok Pesantren Bali Bina Insani</p>
          </div>
          <div style="padding: 30px; color: #334155; line-height: 1.6;">
            <p>Halo,</p>
            <p>Admin kami telah mengirimkan kembali salinan surat keterangan pendaftaran untuk <strong>${data.namaLengkap}</strong>.</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Kode Pendaftaran:</strong> <span style="color: #1A4D2E; font-family: monospace;">${data.kodePendaftaran}</span></p>
            </div>
            <p>Silakan unduh Surat Keterangan Pendaftaran melalui tautan di bawah ini:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${req.nextUrl.origin}/ppdb/sukses?code=${data.kodePendaftaran}" style="background-color: #C9A84C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Surat Keterangan</a>
            </div>
            <p style="color: #ef4444; font-weight: bold; font-style: italic;">PENTING: Harap membawa dokumen fisik (KK, Akta, Ijazah) asli & fotokopi saat jadwal verifikasi lapangan.</p>
            <p>Terima kasih.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Panitia PPSB Bali Bina Insani</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: "Email berhasil dikirim ulang" });

  } catch (error: any) {
    console.error("Resend Admin API Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}

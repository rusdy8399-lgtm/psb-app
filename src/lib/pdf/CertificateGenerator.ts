import jsPDF from "jspdf";
import QRCode from "qrcode";

export interface CertificateData {
  id?: string; // Santri ID for QR verification link
  namaLengkap: string;
  kodePendaftaran: string;
  jenjang: string;
  tempatLahir?: string;
  tanggalLahir: string;
  nisn?: string;
  nik?: string;
  asalSekolah: string;
  tanggalDaftar: string;
  tahunAjaran?: string; // e.g. "2026/2027"
}

export const generateCertificate = async (data: CertificateData) => {
  console.log("PDF Generator: Starting generation with dynamic QR Code");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // --- Outer Border ---
  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 0, 0);
  doc.rect(10, 10, 190, 277);

  // --- Header ---
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("KARTU PENDAFTARAN", 105, 22, { align: "center" });
  doc.setFontSize(11);
  const subtitle = data.tahunAjaran 
    ? data.tahunAjaran.toUpperCase() 
    : "PENERIMAAN SANTRI BARU TH. 2026/2027";
  doc.text(subtitle, 105, 29, { align: "center" });
  doc.setFontSize(14);
  doc.text("PONDOK PESANTREN BALI BINA INSANI", 105, 36, { align: "center" });

  // Add the actual logo asynchronously
  const logoUrl = "/logo-bina-insani.png";
  await new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      doc.addImage(img, "PNG", 15, 14, 25, 25);
      resolve(true);
    };
    img.onerror = () => {
      console.error("Failed to load logo");
      doc.setDrawColor(50, 100, 150);
      doc.circle(25, 27, 12);
      resolve(false);
    };
    img.src = logoUrl;
  });

  // --- Data Section ---
  const dataBoxY = 45;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(15, dataBoxY, 180, 55);

  const startX = 18;
  const colX = 55;
  const startY = dataBoxY + 8;
  const lineGap = 6.5;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  const labels = [
    "Nomor Pendaftaran",
    "Nama Peserta",
    "Tempat Lahir",
    "Tanggal Lahir",
    "NISN",
    "NIK",
    "Asal Sekolah",
  ];

  const values = [
    data.kodePendaftaran || "-",
    (data.namaLengkap || "-").toUpperCase(),
    data.tempatLahir || "-",
    data.tanggalLahir || "-",
    data.nisn || "-",
    data.nik || "-",
    (data.asalSekolah || "-").toUpperCase(),
  ];

  for (let i = 0; i < labels.length; i++) {
    doc.setFont("helvetica", "normal");
    doc.text(labels[i], startX, startY + i * lineGap);
    doc.text(":", colX, startY + i * lineGap);
    doc.text(values[i], colX + 3, startY + i * lineGap);
  }

  // Pas Foto Box
  doc.rect(155, dataBoxY + 5, 30, 40);
  doc.setFontSize(10);
  doc.text("PAS FOTO", 170, dataBoxY + 22, { align: "center" });
  doc.text("3 X 4", 170, dataBoxY + 28, { align: "center" });

  // --- Table Section ---
  const tableY = dataBoxY + 55 + 8;
  doc.setFillColor(61, 155, 99);
  doc.rect(15, tableY, 180, 10, "F");
  doc.rect(15, tableY, 180, 22);
  doc.line(70, tableY, 70, tableY + 22);
  doc.line(145, tableY, 145, tableY + 22);
  doc.line(15, tableY + 10, 195, tableY + 10);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PENDAFTARAN", 42.5, tableY + 6.5, { align: "center" });
  doc.text("JENJANG PENDAFTARAN", 107.5, tableY + 6.5, { align: "center" });
  doc.text("STATUS", 170, tableY + 6.5, { align: "center" });

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(data.tanggalDaftar || "-", 42.5, tableY + 17, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text((data.jenjang || "-").toUpperCase(), 107.5, tableY + 17, { align: "center" });
  doc.text("Terdaftar", 170, tableY + 17, { align: "center" });

  // --- Informasi Penting Section ---
  const infoY = tableY + 22 + 8;
  doc.setDrawColor(0, 0, 0);
  doc.rect(15, infoY, 180, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMASI PENTING", 18, infoY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("1. Simpan kartu pendaftaran ini sebagai bukti pendaftaran yang sah.", 18, infoY + 13);
  doc.text("2. Harap membawa dokumen fisik (KK, Akta Kelahiran, Ijazah) pada jadwal ujian test masuk.", 18, infoY + 19);

  // --- QR Code Implementation ---
  const qrY = infoY + 25 + 12;
  const qrSize = 35;

  try {
    // Generate the verification URL
    const adminUrl = data.id 
      ? `${window.location.origin}/dashboard/pendaftar/${data.id}`
      : `${window.location.origin}/ppdb/sukses?code=${data.kodePendaftaran}`;
    
    const qrDataUrl = await QRCode.toDataURL(adminUrl, {
      margin: 1,
      width: 256,
      errorCorrectionLevel: 'M'
    });

    doc.addImage(qrDataUrl, "PNG", 15, qrY, qrSize, qrSize);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Scan for Verification", 15, qrY + qrSize + 5);
  } catch (qrErr) {
    console.error("QR Code Generation failed", qrErr);
    // Draw placeholder if QR fails
    doc.rect(15, qrY, qrSize, qrSize);
    doc.text("QR ERROR", 15 + qrSize/2, qrY + qrSize/2, { align: 'center' });
  }

  // Output
  const safeName = (data.namaLengkap || "Pendaftar").replace(/[^a-zA-Z0-9_-]/g, "_");
  try {
    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    const pdfWindow = window.open(blobUrl, "_blank");
    if (pdfWindow) {
      pdfWindow.document.title = `Kartu_Pendaftaran_${safeName}.pdf`;
    } else {
      doc.save(`Kartu_Pendaftaran_${safeName}.pdf`);
    }
  } catch (err) {
    doc.save(`Kartu_Pendaftaran_${safeName}.pdf`);
  }
};

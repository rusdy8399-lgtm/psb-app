import Link from "next/link";
import { MapPin, Phone, Mail, FileText, Download } from "lucide-react";

// Custom SVG brand icons (lucide-react brand icons unavailable in this version)
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

interface FooterProps {
  settings?: {
    namaWeb: string;
    alamat?: string | null;
    email?: string | null;
    noWa?: string | null;
    igUrl?: string | null;
    fbUrl?: string | null;
    ytUrl?: string | null;
    brosurUrl?: string | null;
  } | null;
}

export function Footer({ settings }: FooterProps) {
  const schoolName = settings?.namaWeb || "Bali Bina Insani";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#14532d] text-green-100 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Column 1: Brand & Social */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white mb-2">
              {schoolName}
            </h4>
            <p className="text-sm text-green-200 leading-relaxed">
              Platform digital modern untuk Sistem Informasi dan Penerimaan Peserta Didik Baru (PPDB) {schoolName}.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3 mt-3">
              {settings?.igUrl ? (
                <Link href={settings.igUrl} target="_blank" aria-label="Instagram"
                  className="text-green-200 hover:text-white hover:scale-110 transition-all duration-200">
                  <InstagramIcon />
                </Link>
              ) : (
                <span className="text-green-200 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer">
                  <InstagramIcon />
                </span>
              )}
              {settings?.fbUrl ? (
                <Link href={settings.fbUrl} target="_blank" aria-label="Facebook"
                  className="text-green-200 hover:text-white hover:scale-110 transition-all duration-200">
                  <FacebookIcon />
                </Link>
              ) : (
                <span className="text-green-200 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer">
                  <FacebookIcon />
                </span>
              )}
              {settings?.ytUrl ? (
                <Link href={settings.ytUrl} target="_blank" aria-label="Youtube"
                  className="text-green-200 hover:text-white hover:scale-110 transition-all duration-200">
                  <YoutubeIcon />
                </Link>
              ) : (
                <span className="text-green-200 hover:text-white hover:scale-110 transition-all duration-200 cursor-pointer">
                  <YoutubeIcon />
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white mb-3">
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Beranda", href: "/" },
                { label: "Kegiatan", href: "/kegiatan" },
                { label: "Fasilitas", href: "/fasilitas" },
                { label: "Daftar PPDB", href: "/pendaftaran" },
                { label: "Login Admin", href: "/login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-green-200 hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {settings?.brosurUrl && (
                <li>
                  <Link
                    href="/download-brosur"
                    className="text-sm text-green-200 hover:text-white hover:translate-x-0.5 transition-all duration-200 inline-flex items-center gap-1.5"
                  >
                    Download Brosur <Download className="w-3 h-3" />
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white mb-3">
              Kontak Kami
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-green-300 shrink-0" />
                <span className="text-sm text-green-200 leading-relaxed">
                  {settings?.alamat || "Jl. Raya Bali Bina Insani, Kabupaten Tabanan, Bali, Indonesia"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 text-green-300 shrink-0" />
                <span className="text-sm text-green-200">
                  {settings?.noWa || "+62 812 3456 7890"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 text-green-300 shrink-0" />
                <span className="text-sm text-green-200">
                  {settings?.email || "info@balibinainsani.sch.id"}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-green-800 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-1 text-xs text-green-300">
          <p>© {year} Pondok Pesantren Bali Bina Insani. All rights reserved.</p>
          <p>Dikelola oleh Panitia PPDB Online</p>
        </div>
      </div>
    </footer>
  );
}

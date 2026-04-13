import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function KontakPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-heading font-bold text-primary mb-4">Hubungi Kami</h1>
          <p className="text-muted-foreground">
            Punya pertanyaan mengenai pendaftaran santri baru atau program pendidikan pesantren? Jangan ragu hubungi kami.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-xl font-bold font-heading text-primary mb-6">Informasi Kontak</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Alamat Pesantren</h4>
                    <p className="text-sm text-muted-foreground">Jl. Raya Bali Bina Insani, Kabupaten Tabanan, Provinsi Bali, Indonesia</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Telepon / WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">+62 812 3456 7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Email</h4>
                    <p className="text-sm text-muted-foreground">info@balibinainsani.sch.id</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <h3 className="text-2xl font-bold font-heading text-primary mb-6">Kirim Pesan</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input placeholder="Nama Anda" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nomor WhatsApp</label>
                    <Input placeholder="08xx..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subjek</label>
                  <Input placeholder="Perihal pesan" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pesan</label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>
                <Button className="w-full bg-primary hover:bg-primary-light h-12 text-md mt-2">
                  Kirim Pesan Sekarang
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

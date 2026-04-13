import { getKegiatanById, getKegiatanList } from "@/lib/data-fetching";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const items = await getKegiatanList();
  return items.map((item) => ({
    id: item.id.toString(),
  }));
}
import { CalendarDays, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ShareButtons } from "@/components/public/ShareButtons";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

// Generate Dynamic Metadata for Social Sharing (OG Tags)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getKegiatanById(id);

  if (!item) return { title: "Berita Tidak Ditemukan" };

  return {
    title: `${item.judul} | Bali Bina Insani`,
    description: item.deskripsi.substring(0, 160),
    openGraph: {
      title: item.judul,
      description: item.deskripsi.substring(0, 160),
      images: [item.fotoUrl],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: item.judul,
      description: item.deskripsi.substring(0, 160),
      images: [item.fotoUrl],
    },
  };
}

export default async function KegiatanDetailPage({ params }: Props) {
  const { id } = await params;
  
  const item = await getKegiatanById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-12 md:py-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <Link 
          href="/kegiatan" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 font-bold uppercase text-xs tracking-widest group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Kembali ke List Kegiatan
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <CalendarDays className="w-4 h-4" /> {item.tanggal}
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 leading-snug max-w-2xl mx-auto">
            {item.judul}
          </h1>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-video rounded-[32px] overflow-hidden mb-12 shadow-xl shadow-primary/5 border border-slate-100">
          <Image 
            src={item.fotoUrl} 
            alt={item.judul}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-slate prose-lg max-w-none mb-16">
            {item.deskripsi.split('\n').map((para, i) => (
              <p key={i} className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap text-justify">
                {para}
              </p>
            ))}
          </div>

          {/* Share Section at Bottom */}
          <div className="pt-12 border-t border-slate-100">
             <ShareButtons title={item.judul} url={`/kegiatan/${item.id}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

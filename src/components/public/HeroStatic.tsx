import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SliderData {
  id: string;
  badge: string | null;
  title: string;
  subtitle: string | null;
  bgImageUrl: string;
  fgImageUrl: string | null;
}

export function HeroStatic({ slide, brosurUrl }: { slide: SliderData; brosurUrl?: string | null }) {
  return (
    <section className="relative w-full h-[550px] md:h-[650px] flex items-center overflow-hidden bg-[#0d8174] contain-layout-paint">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-[10000ms] scale-100 ease-out">
          <Image
            src={slide.bgImageUrl}
            alt={slide.title}
            fill
            priority
            fetchPriority="high"
            decoding="async"
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
        </div>
        {/* Gradient Overlay - Kontras Tinggi Mobile First */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent z-10" />
        <div className="absolute inset-0 bg-[#0d8174]/10 hidden md:block z-0" />
      </div>
      
      <div className="container relative mx-auto px-6 md:px-12 z-20 h-full flex items-center">
        <div className="flex flex-col md:flex-row items-center w-full justify-between mb-8 md:mb-0 mt-8 md:mt-0">
          {/* Text Content - Vertical Stack Mobile First */}
          <div className="w-full md:max-w-[600px] flex flex-col items-start text-left space-y-4 md:space-y-6">
            {slide.badge && (
              <span className="badge-gold-elegan text-[12px] uppercase tracking-[1.5px] font-bold font-sans">
                {slide.badge}
              </span>
            )}
            
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-[28px] md:text-[32px] font-sans font-bold text-white leading-[1.2] tracking-normal mb-2">
                {slide.title.includes('<br />') ? (
                  slide.title.split('<br />').map((t, i) => (
                    <React.Fragment key={i}>
                      {t}{i < slide.title.split('<br />').length - 1 && <br />}
                    </React.Fragment>
                  ))
                ) : (
                  slide.title
                )}
              </h1>
              
              {slide.subtitle && (
                <p className="text-[14px] md:text-[16px] text-white/80 font-sans font-normal max-w-[500px] leading-relaxed line-clamp-2 md:line-clamp-none">
                  {slide.subtitle.includes('<br />') ? (
                    slide.subtitle.split('<br />').map((s, i) => (
                      <React.Fragment key={i}>
                        {s}{i < slide.subtitle!.split('<br />').length - 1 && <br />}
                      </React.Fragment>
                    ))
                  ) : (
                    slide.subtitle
                  )}
                </p>
              )}
            </div>
            
            <div className="pt-4 md:pt-6 w-full flex flex-col md:flex-row gap-3">
              <Link href="/pendaftaran" className="w-full md:w-auto">
                <Button className="w-full md:w-auto bg-[#1A4D2E] hover:bg-[#133d24] text-white font-semibold h-[48px] md:h-[52px] rounded-xl transition-all text-[16px] flex gap-3 items-center justify-center group/btn border-none font-sans">
                  Penerimaan Murid Baru
                  <ArrowRight className="hidden md:block w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {brosurUrl && (
                <Link href="/download-brosur" className="w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto border border-white/40 bg-transparent hover:bg-white/10 text-white font-semibold h-[48px] md:h-[52px] rounded-xl transition-all text-[16px] flex gap-3 items-center justify-center group/brosur font-sans"
                  >
                    Download Brosur
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Overlay Foreground Image with Floating Animation */}
          {slide.fgImageUrl && (
            <div className="md:w-1/2 h-full hidden md:flex items-end justify-end relative">
              <div className="relative w-[500px] h-[500px] transition-transform duration-1000">
                 {/* Optional Glow beneath image */}
                 <div className="absolute inset-0 bg-gold/20 rounded-full blur-[100px]" />
                <div className="w-full h-full relative z-20">
                  <Image
                    src={slide.fgImageUrl}
                    alt="Visual"
                    fill
                    priority
                    fetchPriority="high"
                    decoding="async"
                    className="object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
                    sizes="(max-width: 1024px) 1px, 500px"
                    quality={75}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

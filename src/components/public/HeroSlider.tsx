"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface SliderData {
  id: string;
  badge: string | null;
  title: string;
  subtitle: string | null;
  bgImageUrl: string;
  fgImageUrl: string | null;
}

export function HeroSlider({ data, brosurUrl }: { data: SliderData[], brosurUrl?: string | null }) {
  const [api, setApi] = React.useState<CarouselApi>();
  
  // Enable Autoplay with 5s delay, and it won't stop permanently on interaction
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      className="w-full relative group overflow-hidden border-none"
    >
      <CarouselContent className="-ml-0">
        {data.map((slide) => (
          <CarouselItem key={slide.id} className="pl-0 border-none outline-none">
            <section className="relative w-full h-[550px] md:h-[650px] flex items-center overflow-hidden bg-[#0d8174]">
              {/* Background Image with Ken Burns effect */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-[10000ms] group-hover:scale-110 ease-out">
                  <Image
                    src={slide.bgImageUrl}
                    alt={slide.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                {/* Gradient Overlay - Darker on the left for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-[#0d8174]/20 z-0" />
              </div>
              
              <div className="container relative mx-auto px-6 md:px-12 z-20 h-full flex items-center">
                <div className="flex flex-col md:flex-row items-center w-full justify-between">
                  {/* Text Content - Reduced width for cleaner layout */}
                  <div className="w-full md:max-w-[600px] text-left space-y-6 animate-in fade-in slide-in-from-left-12 duration-1000">
                    {slide.badge && (
                      <span className="badge-gold-elegan">
                        {slide.badge}
                      </span>
                    )}
                    
                    <div className="space-y-4">
                      <h1 className="text-2xl md:text-4xl font-heading font-extrabold text-white leading-[1.15] drop-shadow-2xl tracking-normal">
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
                        <p className="text-lg md:text-2xl text-gold font-sans font-medium drop-shadow-xl max-w-[500px] leading-relaxed opacity-90">
                          {slide.subtitle?.includes('<br />') ? (
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
                    
                    <div className="pt-4 flex flex-wrap gap-4">
                      <Link href="/ppdb" className="inline-block">
                        <Button className="bg-gold hover:bg-yellow-500 text-[#0d8174] font-bold px-10 h-14 rounded-2xl shadow-[0_10px_30px_rgba(251,191,36,0.3)] transform active:scale-95 transition-all text-lg flex gap-3 items-center group/btn border-none font-heading">
                          Penerimaan Murid Baru
                          <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                        </Button>
                      </Link>

                      {brosurUrl && (
                        <Link href="/brosur" className="inline-block">
                          <Button
                            variant="outline"
                            className="border-2 border-white/30 bg-white/5 hover:bg-white/10 text-white font-bold px-8 h-14 rounded-2xl backdrop-blur-sm transform active:scale-95 transition-all text-lg flex gap-3 items-center group/brosur border-none font-heading"
                          >
                            <FileText className="w-6 h-6 text-gold group-hover/brosur:scale-110 transition-transform" />
                            Download Brosur
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Overlay Foreground Image with Floating Animation */}
                  {slide.fgImageUrl && (
                    <div className="md:w-1/2 h-full hidden md:flex items-end justify-end relative animate-in fade-in zoom-in-90 duration-1000 delay-300">
                      <div className="relative w-[500px] h-[500px] group-hover:rotate-1 transition-transform duration-1000">
                         {/* Optional Glow beneath image */}
                         <div className="absolute inset-0 bg-gold/20 rounded-full blur-[100px] animate-pulse" />
                        <div className="w-full h-full relative z-20 animate-float image-shimmer">
                          <Image
                            src={slide.fgImageUrl}
                            alt="Visual"
                            fill
                            className="object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
                            sizes="500px"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Premium Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-6 pointer-events-none">
        <button 
          onClick={() => api?.scrollPrev()}
          className="pointer-events-auto w-14 h-14 bg-white/10 hover:bg-gold hover:text-[#0d8174] text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-90"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={() => api?.scrollNext()}
          className="pointer-events-auto w-14 h-14 bg-white/10 hover:bg-gold hover:text-[#0d8174] text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-90"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Progress Bars (Dots) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              api?.selectedScrollSnap() === i ? "bg-gold w-12" : "bg-white/30 w-3 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </Carousel>
  );
}

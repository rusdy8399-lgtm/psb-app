"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isVideoUrl, resolveMediaUrl } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [hasHydrated, setHasHydrated] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [autoplayPlugin, setAutoplayPlugin] = React.useState<any>(null);

  React.useEffect(() => {
    setHasHydrated(true);

    // Dynamic CSS Loading
    import("@/styles/carousel.css");
    import("@/styles/animations.css");

    // Lazy load Embla Autoplay only on the client side
    import("embla-carousel-autoplay").then((mod) => {
      setAutoplayPlugin(() =>
        mod.default({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
      );
    });
  }, []);

  React.useEffect(() => {
    if (!api) return;

    setCurrentIndex(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Pause autoplay if tab is inactive
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!autoplayPlugin) return;
      if (document.hidden) {
        autoplayPlugin.stop();
      } else {
        autoplayPlugin.play();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoplayPlugin]);

  const shouldRenderImage = (index: number) => {
    if (index === 0) return true; // Always render slide 0 for LCP and SSR matching
    if (!hasHydrated) return false; // Prevent hydration mismatch during SSR

    const len = data.length;
    const isAdjacent =
      Math.abs(index - currentIndex) <= 1 ||
      (currentIndex === 0 && index === len - 1) ||
      (currentIndex === len - 1 && index === 0);

    return isAdjacent;
  };

  return (
    <Carousel
      setApi={setApi}
      plugins={autoplayPlugin ? [autoplayPlugin] : []}
      className="w-full relative group overflow-hidden border-none"
    >
      <CarouselContent className="-ml-0">
        {data.map((slide, index) => (
          <CarouselItem key={slide.id} className="pl-0 border-none outline-none">
            <section className="relative w-full flex flex-col md:flex-row md:items-center overflow-hidden bg-[#1A4D2E] md:h-[650px] contain-layout-paint">
              {/* Photo or Video Container: Dedicated 16:9 Aspect Ratio on Mobile & Fullcover Background on Desktop */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-auto md:absolute md:inset-0 z-0 overflow-hidden shrink-0 shadow-sm md:shadow-none bg-black">
                <div className="w-full h-full md:absolute md:inset-0">
                  {shouldRenderImage(index) && slide.bgImageUrl && (() => {
                    const mediaUrl = resolveMediaUrl(slide.bgImageUrl);
                    const isVideo = isVideoUrl(mediaUrl) || isVideoUrl(slide.bgImageUrl);

                    return isVideo ? (
                      <video
                        ref={(el) => {
                          if (el) {
                            el.defaultMuted = true;
                            el.muted = isMuted;
                            const p = el.play();
                            if (p !== undefined) {
                              p.catch(() => { });
                            }
                          }
                        }}
                        key={mediaUrl}
                        src={mediaUrl}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover object-center"
                      >
                        <source src={mediaUrl} type="video/mp4" />
                        <source src={mediaUrl} type="video/webm" />
                      </video>
                    ) : (
                      <div className="w-full h-full md:absolute md:inset-0 transition-transform duration-[10000ms] group-hover:scale-105 ease-out">
                        <Image
                          src={mediaUrl}
                          alt={slide.title}
                          fill
                          preload={index === 0}
                          fetchPriority={index === 0 ? "high" : "low"}
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, 1920px"
                          quality={85}
                        />
                      </div>
                    );
                  })()}
                </div>

                {/* Mute/Unmute Audio Button if Current Slide is a Video */}
                {slide.bgImageUrl && (isVideoUrl(slide.bgImageUrl) || isVideoUrl(resolveMediaUrl(slide.bgImageUrl))) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    aria-label={isMuted ? "Aktifkan suara video" : "Bisukan video"}
                    className="absolute top-3 right-3 md:top-6 md:right-6 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-medium border border-white/20 transition-all cursor-pointer shadow-lg group/mute"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4 text-white/80 group-hover/mute:text-white" />
                        <span className="hidden sm:inline text-[11px]">Suara Mati</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="hidden sm:inline text-[11px] text-emerald-400 font-semibold">Suara Aktif</span>
                      </>
                    )}
                  </button>
                )}

                {/* Gradient Overlay for Desktop (and soft gradient for mobile image base) */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10 pointer-events-none" />
                <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 z-10 pointer-events-none" />
              </div>

              {/* Text Content & Action Buttons */}
              <div className="container relative mx-auto px-5 pt-6 pb-14 md:px-12 md:py-0 z-20 md:h-full flex items-center">
                <div className="flex flex-col md:flex-row items-center w-full justify-between">
                  {/* Text Content */}
                  <div className="w-full md:max-w-[600px] flex flex-col items-start text-left space-y-3 md:space-y-6 animate-in fade-in slide-in-from-left-12 duration-1000">
                    {slide.badge && (
                      <span className="badge-gold-elegan text-[11px] md:text-[12px] uppercase tracking-[1.5px] font-bold font-sans">
                        {slide.badge}
                      </span>
                    )}

                    <div className="space-y-1.5 md:space-y-4">
                      <h1 className="text-[24px] sm:text-[28px] md:text-[32px] font-sans font-bold text-white leading-[1.25] tracking-normal mb-1">
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
                        <p className="text-[13px] sm:text-[14px] md:text-[16px] text-white/85 font-sans font-normal max-w-[500px] leading-relaxed line-clamp-2 md:line-clamp-none">
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

                    <div className="pt-2 md:pt-6 w-full flex flex-col sm:flex-row gap-2.5 md:gap-3">
                      <Link href="/pendaftaran" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-[#1A4D2E] hover:bg-[#133d24] text-white font-semibold h-[46px] md:h-[52px] rounded-xl transition-all text-[15px] md:text-[16px] flex gap-3 items-center justify-center group/btn border-none font-sans shadow-md">
                          Penerimaan Murid Baru
                          <ArrowRight className="hidden md:block w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>

                      {brosurUrl && (
                        <Link href="/download-brosur" className="w-full sm:w-auto">
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto border border-white/40 bg-white/5 hover:bg-white/15 text-white font-semibold h-[46px] md:h-[52px] rounded-xl transition-all text-[15px] md:text-[16px] flex gap-3 items-center justify-center group/brosur font-sans"
                          >
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
                        <div className="w-full h-full relative z-20 animate-float">
                          {shouldRenderImage(index) && (
                            <Image
                              src={slide.fgImageUrl}
                              alt="Visual"
                              fill
                              className="object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
                              sizes="(max-width: 1024px) 1px, 500px"
                              quality={75}
                            />
                          )}
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

      {/* Premium Navigation Arrows - Hidden on mobile */}
      <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 justify-between px-6 pointer-events-none">
        <button
          onClick={() => api?.scrollPrev()}
          aria-label="Slide sebelumnya"
          className="pointer-events-auto w-14 h-14 bg-white/10 hover:bg-gold hover:text-[#0d8174] text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-90 cursor-pointer will-change-transform"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          aria-label="Slide berikutnya"
          className="pointer-events-auto w-14 h-14 bg-white/10 hover:bg-gold hover:text-[#0d8174] text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-90 cursor-pointer will-change-transform"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Progress Bars (Dots) - Touch Target Compliant (48x48px) but visually styled as tiny dots */}
      <div className="absolute bottom-3 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-0.5 md:gap-1">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Buka slide ${i + 1}`}
            className="w-12 h-12 flex items-center justify-center focus:outline-none group/dot cursor-pointer bg-transparent border-none p-0"
          >
            <span
              className={`rounded-full transition-all duration-500 bg-white/40 group-hover/dot:bg-white/80 ${currentIndex === i ? "bg-white w-6 md:w-12 h-[4px] md:h-1.5" : "w-[6px] md:w-3 h-[4px] md:h-1.5"
                }`}
            />
          </button>
        ))}
      </div>
    </Carousel>
  );
}

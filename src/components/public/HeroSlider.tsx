"use client";

import { useState, useEffect } from "react";
import { HeroStatic } from "./HeroStatic";
import dynamic from "next/dynamic";

const HeroCarouselClient = dynamic(
  () => import("./HeroCarouselClient").then((mod) => mod.HeroCarouselClient),
  { ssr: false }
);

interface SliderData {
  id: string;
  badge: string | null;
  title: string;
  subtitle: string | null;
  bgImageUrl: string;
  fgImageUrl: string | null;
}

export function HeroSlider({ data, brosurUrl }: { data: SliderData[]; brosurUrl?: string | null }) {
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const idle = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 200));
      idle(() => {
        setShowCarousel(true);
      });
    }
  }, []);

  if (!showCarousel || data.length <= 1) {
    return <HeroStatic slide={data[0]} brosurUrl={brosurUrl} />;
  }

  return <HeroCarouselClient data={data} brosurUrl={brosurUrl} />;
}

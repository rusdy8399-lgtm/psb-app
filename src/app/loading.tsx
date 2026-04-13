import React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
        </div>
        <div className="flex gap-1 animate-pulse">
          <div className="w-2 h-2 bg-gold rounded-full" />
          <div className="w-2 h-2 bg-gold rounded-full [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-gold rounded-full [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}

import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:h-[650px] bg-slate-100 relative overflow-hidden">
      <div className="w-full aspect-[16/9] md:hidden bg-slate-200 animate-pulse" />
      <div className="container mx-auto px-5 pt-6 pb-14 md:px-12 md:py-0 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:max-w-[600px] space-y-4 md:space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3 md:space-y-4">
            <Skeleton className="h-8 md:h-12 w-full md:w-[500px]" />
            <Skeleton className="h-8 md:h-12 w-3/4 md:w-[400px]" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Skeleton className="h-12 w-full sm:w-40 rounded-xl" />
            <Skeleton className="h-12 w-full sm:w-40 rounded-xl" />
          </div>
        </div>
        <div className="hidden md:block w-[400px] h-[400px]">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 p-4 space-y-4">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

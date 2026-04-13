"use client";

import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-[550px] md:h-[650px] bg-slate-100 relative overflow-hidden flex items-center">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:max-w-[600px] space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full md:w-[500px]" />
            <Skeleton className="h-12 w-3/4 md:w-[400px]" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-14 w-40 rounded-2xl" />
            <Skeleton className="h-14 w-40 rounded-2xl" />
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

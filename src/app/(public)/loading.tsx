import { GridSkeleton, HeroSkeleton } from "@/components/public/Skeletons";

export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Skeleton for Hero (common in landing and detail) */}
      <HeroSkeleton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <div className="h-4 w-32 bg-slate-100 animate-pulse mx-auto rounded" />
            <div className="h-10 w-full bg-slate-100 animate-pulse rounded" />
          </div>
          <GridSkeleton />
        </div>
      </div>
    </div>
  );
}

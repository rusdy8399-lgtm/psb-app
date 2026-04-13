"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => router.push(createPageURL(currentPage - 1))}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </Button>
      
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          // Simple logic: show first, last, and relative pages
          const isRelative = Math.abs(page - currentPage) <= 1;
          const isEnds = page === 1 || page === totalPages;
          
          if (!isRelative && !isEnds) {
             if (page === 2 || page === totalPages - 1) return <span key={page}>...</span>;
             return null;
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => router.push(createPageURL(page))}
              className="w-9 h-9 p-0"
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => router.push(createPageURL(currentPage + 1))}
        className="gap-2"
      >
        Next <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

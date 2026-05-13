"use client";

import { Skeleton } from "@/src/components/ui/skeleton";

interface GlobalSkeletonProps {
  type?: "page" | "grid" | "dashboard";
  showHeader?: boolean;
}

export const GlobalSkeleton = ({ type = "page", showHeader = true }: GlobalSkeletonProps) => {
  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-6 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl space-y-6">
            <div className="flex items-start justify-between">
              <Skeleton className="w-20 h-20 rounded-3xl bg-gray-200 dark:bg-white/10" />
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="w-16 h-8 rounded-lg bg-gray-200 dark:bg-white/10" />
                <Skeleton className="w-12 h-6 rounded-lg bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 rounded-xl bg-gray-200 dark:bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-lg bg-gray-200 dark:bg-white/10" />
                <Skeleton className="h-4 w-5/6 rounded-lg bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200 dark:bg-white/10" />
              <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl bg-gray-200 dark:bg-white/10" />
            <Skeleton className="h-4 w-48 rounded-lg bg-gray-200 dark:bg-white/10" />
          </div>
          <Skeleton className="h-12 w-40 rounded-xl bg-gray-200 dark:bg-white/10" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-white/10" />
          ))}
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-white/10" />
          <Skeleton className="h-[400px] rounded-3xl bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-12 pb-20 animate-in fade-in duration-500">
      {showHeader && (
        <>
          <div className="flex justify-start">
            <Skeleton className="h-10 w-32 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="text-center space-y-6">
            <Skeleton className="h-16 w-3/4 mx-auto rounded-2xl bg-gray-200 dark:bg-white/10" />
            <Skeleton className="h-6 w-1/2 mx-auto rounded-xl bg-gray-200 dark:bg-white/10" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <Skeleton className="h-14 flex-1 rounded-2xl bg-gray-200 dark:bg-white/10" />
            <Skeleton className="h-14 w-32 rounded-2xl bg-gray-200 dark:bg-white/10" />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-6 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl space-y-6">
            <div className="flex items-start justify-between">
              <Skeleton className="w-20 h-20 rounded-3xl bg-gray-200 dark:bg-white/10" />
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="w-16 h-8 rounded-lg bg-gray-200 dark:bg-white/10" />
                <Skeleton className="w-12 h-6 rounded-lg bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 rounded-xl bg-gray-200 dark:bg-white/10" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-lg bg-gray-200 dark:bg-white/10" />
                <Skeleton className="h-4 w-5/6 rounded-lg bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200 dark:bg-white/10" />
              <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

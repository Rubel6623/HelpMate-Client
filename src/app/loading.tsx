import { GlobalSkeleton } from "@/src/components/shared/GlobalSkeleton";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Skeleton */}
      <div className="py-4 bg-background/80 sticky top-0 z-50 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-xl bg-primary/20" />
            <Skeleton className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <Skeleton className="h-4 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
            <Skeleton className="h-4 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
            <Skeleton className="h-4 w-20 rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-white/10" />
            <Skeleton className="h-10 w-24 rounded-xl bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
      </div>

      <div className="container px-6 md:px-20 py-12">
        <GlobalSkeleton type="page" />
      </div>
    </div>
  );
}

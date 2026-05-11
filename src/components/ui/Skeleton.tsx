interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-800/50 ${className}`}
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-xl bg-neutral-900/80 border border-neutral-800/50">
      {/* Thumbnail skeleton */}
      <div className="relative aspect-video">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

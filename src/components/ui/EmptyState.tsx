import { Film, Upload } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showUploadButton?: boolean;
}

export default function EmptyState({
  title = "No movies yet",
  description = "Upload your first movie to get started. Your collection awaits!",
  showUploadButton = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      {/* Icon with glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-red-600/20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800/80 border border-neutral-700/50">
          <Film className="h-10 w-10 text-neutral-500" />
        </div>
      </div>

      <h3 className="mb-2 text-xl font-semibold text-neutral-200">{title}</h3>
      <p className="mb-8 max-w-sm text-center text-sm text-neutral-500 leading-relaxed">
        {description}
      </p>

      {showUploadButton && (
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/25 active:scale-95"
        >
          <Upload className="h-4 w-4" />
          Upload Movie
        </Link>
      )}
    </div>
  );
}

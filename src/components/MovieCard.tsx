"use client";

import { useState } from "react";
import { Play, Download, Trash2, Clock, HardDrive } from "lucide-react";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { formatFileSize, formatDuration, formatRelativeTime } from "@/lib/format";
import DeleteConfirmModal from "./DeleteConfirmModal";
import axios from "axios";
import toast from "react-hot-toast";

interface MovieCardProps {
  movie: Movie;
  onDeleted: (id: string) => void;
}

export default function MovieCard({ movie, onDeleted }: MovieCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getDirectDownloadUrl = (url: string) => {
    // Cloudinary: force download via `fl_attachment` so it doesn't open the player.
    if (url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/movies/${movie.id}`);
      if (res.data.success) {
        toast.success("Movie deleted successfully");
        onDeleted(movie.id);
      } else {
        toast.error(res.data.error || "Failed to delete movie");
      }
    } catch {
      toast.error("Failed to delete movie");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = getDirectDownloadUrl(movie.secureUrl);
    link.download = movie.originalFilename || "movie";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl bg-neutral-900/80 border border-neutral-800/50 transition-all duration-300 hover:border-neutral-700/50 hover:shadow-xl hover:shadow-red-900/10 hover:-translate-y-1">
        {/* Thumbnail */}
        <Link href={`/watch/${movie.id}`} className="relative block aspect-video overflow-hidden">
          {!imageError ? (
            <img
              src={movie.thumbnailUrl}
              alt={movie.originalFilename}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-800">
              <Play className="h-12 w-12 text-neutral-600" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 shadow-lg shadow-red-600/30 transition-transform duration-200 hover:scale-110">
              <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
            </div>
          </div>

          {/* Duration badge */}
          {movie.duration > 0 && (
            <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {formatDuration(movie.duration)}
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <Link href={`/watch/${movie.id}`}>
            <h3 className="mb-2 text-sm font-semibold text-neutral-100 line-clamp-1 transition-colors group-hover:text-white">
              {movie.originalFilename}
            </h3>
          </Link>

          {/* Meta info */}
          <div className="mb-3 flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              {formatFileSize(movie.bytes)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(movie.createdAt)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              href={`/watch/${movie.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-600/20 hover:text-red-300"
            >
              <Play className="h-3 w-3" />
              Stream
            </Link>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white"
            >
              <Download className="h-3 w-3" />
              Download
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="ml-auto rounded-lg p-1.5 text-neutral-600 transition-all hover:bg-red-600/10 hover:text-red-400"
              title="Delete movie"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        movieName={movie.originalFilename}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />
    </>
  );
}

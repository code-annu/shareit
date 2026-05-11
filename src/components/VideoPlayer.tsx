"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  Download,
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
} from "lucide-react";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { formatFileSize, formatDuration, formatDate } from "@/lib/format";
import toast from "react-hot-toast";

interface VideoPlayerProps {
  movie: Movie;
}

export default function VideoPlayer({ movie }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const getDirectDownloadUrl = (url: string) => {
    // Cloudinary: force download via `fl_attachment` so it doesn't open the player.
    if (url.includes("/upload/")) {
      return url.replace("/upload/", "/upload/fl_attachment/");
    }
    return url;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
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
    <div className="animate-fadeIn">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      {/* Video player */}
      <div
        className="relative overflow-hidden rounded-2xl bg-black shadow-2xl shadow-black/50"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={movie.secureUrl}
          className="w-full aspect-video"
          controls
          controlsList="nodownload"
          preload="metadata"
          poster={movie.thumbnailUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Custom overlay controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="rounded-lg p-2 text-white transition-colors hover:bg-white/10"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="rounded-lg p-2 text-white transition-colors hover:bg-white/10"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="rounded-lg p-2 text-white transition-colors hover:bg-white/10"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Movie info */}
      <div className="mt-6 space-y-4">
        <h1 className="text-2xl font-bold text-white">
          {movie.originalFilename}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
          {movie.duration > 0 && (
            <span className="rounded-full bg-neutral-800/80 px-3 py-1">
              🕐 {formatDuration(movie.duration)}
            </span>
          )}
          <span className="rounded-full bg-neutral-800/80 px-3 py-1">
            💾 {formatFileSize(movie.bytes)}
          </span>
          <span className="rounded-full bg-neutral-800/80 px-3 py-1">
            📅 {formatDate(movie.createdAt)}
          </span>
          {movie.format && (
            <span className="rounded-full bg-neutral-800/80 px-3 py-1 uppercase">
              📁 {movie.format}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

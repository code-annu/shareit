"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import { Movie } from "@/types/movie";
import { Skeleton } from "@/components/ui/Skeleton";
import { Film } from "lucide-react";
import Link from "next/link";

function WatchContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}`);
        if (response.data.success) {
          setMovie(response.data.movie);
        } else {
          setError("Movie not found");
        }
      } catch {
        setError("Failed to load movie");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="mb-4 h-8 w-48" />
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="mt-6 h-8 w-64" />
          <Skeleton className="mt-3 h-5 w-96" />
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-24 text-center">
          <Film className="mx-auto mb-4 h-16 w-16 text-neutral-700" />
          <h2 className="text-xl font-semibold text-neutral-300">
            {error || "Movie not found"}
          </h2>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-red-500"
          >
            Back to Library
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <VideoPlayer movie={movie} />
      </main>
    </div>
  );
}

export default function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AuthGuard>
      <WatchContent params={params} />
    </AuthGuard>
  );
}

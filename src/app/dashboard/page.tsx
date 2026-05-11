"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Film } from "lucide-react";
import axios from "axios";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import MovieGrid from "@/components/MovieGrid";
import { Movie } from "@/types/movie";

function DashboardContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch movies on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/api/movies");
        if (response.data.success) {
          setMovies(response.data.movies);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Filter movies by search
  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase();
    return movies.filter((m) =>
      m.originalFilename.toLowerCase().includes(q)
    );
  }, [movies, searchQuery]);

  const handleMovieDeleted = (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Film className="h-6 w-6 text-red-500" />
              My Library
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {movies.length} {movies.length === 1 ? "movie" : "movies"} in your
              collection
            </p>
          </div>

          {/* Search */}
          {movies.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 outline-none transition-all focus:border-neutral-700 focus:ring-2 focus:ring-red-600/10"
              />
            </div>
          )}
        </div>

        {/* Movie grid */}
        <MovieGrid
          movies={filteredMovies}
          isLoading={isLoading}
          onMovieDeleted={handleMovieDeleted}
        />

        {/* No search results */}
        {!isLoading && searchQuery && filteredMovies.length === 0 && movies.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
            <Search className="mb-4 h-12 w-12 text-neutral-700" />
            <p className="text-neutral-400">
              No movies match &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

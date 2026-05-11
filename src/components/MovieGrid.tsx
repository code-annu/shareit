"use client";

import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";
import { MovieGridSkeleton } from "./ui/Skeleton";
import EmptyState from "./ui/EmptyState";

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  onMovieDeleted: (id: string) => void;
}

export default function MovieGrid({
  movies,
  isLoading,
  onMovieDeleted,
}: MovieGridProps) {
  if (isLoading) {
    return <MovieGridSkeleton />;
  }

  if (movies.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fadeIn">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onDeleted={onMovieDeleted} />
      ))}
    </div>
  );
}

import fs from "fs";
import path from "path";
import { Movie } from "@/types/movie";

/**
 * Simple JSON file-based movie metadata storage.
 *
 * For production / Vercel deployment, replace this with:
 *   - Prisma + PostgreSQL (recommended)
 *   - MongoDB
 *   - Any other database
 *
 * This file-based approach works for:
 *   - Local development
 *   - Self-hosted deployments (VPS, Docker)
 *
 * ⚠️ On Vercel serverless, the filesystem is ephemeral.
 *    Data will be lost on each deployment / cold start.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "movies.json");

/** Ensure the data directory and file exist */
function ensureDb(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, "[]", "utf-8");
  }
}

/** Read all movies from the JSON file */
export async function getMovies(): Promise<Movie[]> {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    const movies: Movie[] = JSON.parse(raw);
    // Sort by createdAt descending (newest first)
    return movies.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

/** Get a single movie by ID */
export async function getMovieById(id: string): Promise<Movie | null> {
  const movies = await getMovies();
  return movies.find((m) => m.id === id) || null;
}

/** Add a new movie record */
export async function addMovie(movie: Movie): Promise<Movie> {
  ensureDb();
  const movies = await getMovies();
  movies.push(movie);
  fs.writeFileSync(DB_PATH, JSON.stringify(movies, null, 2), "utf-8");
  return movie;
}

/** Delete a movie by ID and return the deleted movie */
export async function deleteMovie(id: string): Promise<Movie | null> {
  ensureDb();
  const movies = await getMovies();
  const index = movies.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const [deleted] = movies.splice(index, 1);
  fs.writeFileSync(DB_PATH, JSON.stringify(movies, null, 2), "utf-8");
  return deleted;
}
